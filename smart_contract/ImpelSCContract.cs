using System;
using System.ComponentModel;
using System.Numerics;

using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

namespace Impel
{
    [DisplayName("Impel.ImpelSCv0.6")]
    [ManifestExtra("Author", "Kinshuk Kar, Pompita Sarkar")]
    [ManifestExtra("Email", "kinshuk89@gmail.com")]
    [ManifestExtra("Description", "A novel motivation mechanism to assist people in getting fitter with social and financial rewards")]
    [ContractPermission("*", "onNEP17Payment")]
    [ContractPermission("0x95bc4c2d84c0b5b0a028e83a5e70f198815a488e", "*")]
    [ContractTrust("0x95bc4c2d84c0b5b0a028e83a5e70f198815a488e")]
    [ContractTrust("0xd2a4cff31913016155e38e474a2c06d08be276cf")]
    public class ImpelSCContract : SmartContract
    {
        static readonly ImpelStorage contractDataManager = new ImpelStorage();
        private static Transaction Tx => (Transaction) Runtime.ScriptContainer;

        static UInt160 IMPEL_NFT_TOKEN_CONTRACT_HASH = ToScripthash("NM9D5C2wdjgiN6EkcWmRccMh7TX5V9zTen");        
        
        public delegate void OnChallengeSubscribedDelegate(UInt160 user, BigInteger challengeId, BigInteger commitAmount);
        [DisplayName("ChallengeSubscribed")]
        public static event OnChallengeSubscribedDelegate OnChallengeSubscribed;

        public delegate void OnChallengeEvaluatedDelegate(BigInteger challengeId);
        [DisplayName("ChallengeEvaluated")]
        public static event OnChallengeEvaluatedDelegate OnChallengeEvaluated;

        public delegate void OnRewardsDistributedDelegate(BigInteger challengeId);
        [DisplayName("RewardsSubscribed")]
        public static event OnRewardsDistributedDelegate OnRewardsDistributed;

        [DisplayName("_deploy")]
        public static void deploy(object data, bool update) {
            if (!update)
            {
                initialize();
            }
        }

        public static bool Verify()
        {
            return Runtime.CheckWitness(ToScripthash(contractDataManager.GetOwner()));
        }
        private static void initialize() {

            contractDataManager.PutOwner(ToAddress((ByteString) Tx.Sender));
            contractDataManager.ResetLastChallengeId();
        }

        public static void updateContract(ByteString nefFile, string manifest) {
            string owner = contractDataManager.GetOwner();
            if (!ToAddress((ByteString)Tx.Sender).Equals(owner))
            {
                throw new Exception("Only the contract owner can do this");
            }
            ContractManagement.Update(nefFile, manifest, null);
        }

        public static void destroyContract(ByteString nefFile, string manifest) {
            string owner = contractDataManager.GetOwner();
            if (!ToAddress((ByteString)Tx.Sender).Equals(owner))
            {
                throw new Exception("Only the contract owner can do this");
            }
            ContractManagement.Destroy();
        }

        private static string ToAddress(ByteString sender) {
            var address = StdLib.Base58CheckEncode("5" + sender);
            return (address);
        }

        private static UInt160 ToScripthash(String address) {
            if ((address.ToByteArray())[0] == 0x4e)
            {
                var decoded = (byte[]) StdLib.Base58CheckDecode(address);
                var Scripthash = (UInt160)decoded.Last(20);
                return (Scripthash);
            }
            return null;
        }

        public Challenge getChallengeDetails(BigInteger challengeId) {
            return contractDataManager.GetChallenge(challengeId);
        }

        public static Boolean addChallenge(string title, ulong startTime, ulong endTime, ulong evaluationTime, Challenge.ChallengeActivityType activityType, Challenge.ChallengeType type, BigInteger value) {

            if (!ToAddress((ByteString)Tx.Sender).Equals(contractDataManager.GetOwner())) { throw new Exception("Only the contract owner can do this"); }

            BigInteger newChallengeId = contractDataManager.GetAndIncrementLastChallengeId();
            Challenge newChallenge = new Challenge(title, startTime, endTime, evaluationTime, activityType, type, value);
            contractDataManager.PutChallenge(newChallengeId, newChallenge);
            return true;
        }

        public static Boolean updateChallengeState(BigInteger challengeId) {
            
            if (!ToAddress((ByteString)Tx.Sender).Equals(contractDataManager.GetOwner())) { throw new Exception("Only the contract owner can do this"); }
            
            Challenge challenge = contractDataManager.GetChallenge(challengeId);
            ulong currentTime = Ledger.GetBlock(Ledger.CurrentIndex).Timestamp;
            if (currentTime > challenge.challengeEvaluationTime) {
                challenge.challengeState = Challenge.ChallengeState.ChallengeStateEvaluationCompleted;
            } else if (currentTime > challenge.challengeEndTime) {
                challenge.challengeState = Challenge.ChallengeState.ChallengeStateCompleted;
            } else if (currentTime > challenge.challengeStartTime) {
                challenge.challengeState = Challenge.ChallengeState.ChallengeStateActive;                
            } else {
                challenge.challengeState = Challenge.ChallengeState.ChallengeStateNotStarted;                
            }
            contractDataManager.PutChallenge(challengeId, challenge);

            return true;
        }

        public static Boolean registerUser(string address, string username) {
            User newUser = new User(username);
            contractDataManager.PutUser(address, newUser);

            return true;
        }

        public static User retrieveUser() {
            return retrieveUserByAddress(ToAddress((ByteString) Tx.Sender));
        }

        public static User retrieveUserByAddress(string address) {
            return contractDataManager.GetUser(address);
        }

        public List<Challenge> getAllChallenges() {
            return contractDataManager.GetAllChallenges(false);
        }

        public List<Challenge> getActiveChallenges() {
            return contractDataManager.GetAllChallenges(true);
        }

        public List<UserChallengeEntry> getSubscribedEntriesForChallenge(BigInteger challengeId) {
            return contractDataManager.GetSubscribedEntriesForChallenge(challengeId);
        }

        public List<UserChallengeEntry> getSubscribedChallengesForUser(string address) {
            return contractDataManager.GetSubscribedChallengesForUser(address);
        }

        public Boolean updateChallengeEntryState(BigInteger challengeId, string userKey, UserChallengeEntry.UserChallengeState state) {

            if (!ToAddress((ByteString)Tx.Sender).Equals(contractDataManager.GetOwner())) { throw new Exception("Only the contract owner can do this"); }

            string userChallengeKey = "c#" + challengeId + userKey;
            UserChallengeEntry challengeEntry = contractDataManager.GetChallengeEntry(userChallengeKey);
            challengeEntry.state = state;
            contractDataManager.PutChallengeEntry(userChallengeKey, challengeEntry);
            return true;
        }

        public static void OnNEP17Payment(UInt160 from, BigInteger amount, object[] data) {

            if (!Runtime.CheckWitness(from)) throw new Exception("Check your signature.");

            if (Runtime.CallingScriptHash == GAS.Hash) {
                if (data.Length == 2 && (string)data[0] == "join_challenge") {
                    BigInteger challengeId = (BigInteger) data[1];
                    contractDataManager.AddUserChallengeRecord(challengeId, ToAddress((ByteString) from), amount);

                    OnChallengeSubscribed(from, challengeId, amount);
                }
            }
        }

        // public static void ValidateChallengeEntries(BigInteger challengeId, long gasPrice) {
            
        //     string url = "https://raw.githubusercontent.com/kinshukkar/i-data/main/test.json";
        //     string filter = "$.activity_records";
        //     string callback = "fcecallback";
        //     FetchUserChallengeEntries(challengeId, url, filter, callback, gasPrice);

        // }
        public static void fetchChallengeEntries(BigInteger challengeId, string url, string filter, string callback, long gasPrice)
        {
            Oracle.Request(url, filter, callback, (ByteString)challengeId, gasPrice);
        }

        public static void fcecallback(string url, ByteString data, OracleResponseCode code, string result)
        {
            if (Runtime.CallingScriptHash != Oracle.Hash) throw new Exception("Unauthorized!");

            if (code != OracleResponseCode.Success) throw new Exception("Oracle response failure with code " + (byte)code);

            contractDataManager.PutOracleResp((BigInteger)data, "", result);
        }

        public static void evaluateChallengeEntries(BigInteger challengeId) {

            if (!ToAddress((ByteString)Tx.Sender).Equals(contractDataManager.GetOwner())) { throw new Exception("Only the contract owner can do this"); }

            string result = contractDataManager.GetOracleResp(challengeId, "");
            contractDataManager.PutOracleResp(challengeId, "C", result);

            Map<ByteString, List<BigInteger>> activityRecords = (Map<ByteString, List<BigInteger>>) StdLib.JsonDeserialize(result);

            Challenge challenge = contractDataManager.GetChallenge(challengeId);
            contractDataManager.PutOracleResp(challengeId, "D", StdLib.Serialize(challenge) );

            List<UserChallengeEntry> entries = contractDataManager.GetSubscribedEntriesForChallenge(challengeId);

            foreach (var entry in entries)
            {
                if(entry.state == UserChallengeEntry.UserChallengeState.DataNotSubmitted) {
                    continue;
                }

                List<BigInteger> records = activityRecords[entry.userKey];
                contractDataManager.PutOracleResp(challengeId, "E", records.ToString());
                BigInteger qualified = 0;
                BigInteger aggregate = 0;

                foreach (BigInteger record in records) {

                    aggregate = aggregate + record;
                    if (record > challenge.challengeValue && challenge.challengeType == Challenge.ChallengeType.ChallengeTypeMax) {
                        qualified = 1;
                        break;
                    }

                    if (aggregate > challenge.challengeValue && challenge.challengeType == Challenge.ChallengeType.ChallengeTypeAggregate) {
                        qualified = 1;
                        break;                     
                    }
                }
                if (qualified == 1) {
                    entry.state = UserChallengeEntry.UserChallengeState.DataSubmittedQualified;
                } else {
                    entry.state = UserChallengeEntry.UserChallengeState.DataSubmittedNotQualified;              
                }
                string entryKey = "c#" + challengeId + entry.userKey;
                contractDataManager.PutChallengeEntry(entryKey, entry);

                OnChallengeEvaluated(challengeId);
            }
        }
        
        public static Boolean distributeRewards(BigInteger challengeId) {

            if (!ToAddress((ByteString)Tx.Sender).Equals(contractDataManager.GetOwner())) { throw new Exception("Only the contract owner can do this"); }

            Challenge challenge = contractDataManager.GetChallenge(challengeId);
            List<UserChallengeEntry> entries = contractDataManager.GetSubscribedEntriesForChallenge(challengeId);

            //NFT Token setup
            String tokenName = "Winner of " + challenge.challengeTitle;
            String tokenDescription = "Badge for " + challenge.challengeTitle;
            string tokenURL = "https://impelapp.com/images/badges/" + challenge.challengeId +".png";

            foreach (var entry in entries) {

                if (entry.state != UserChallengeEntry.UserChallengeState.DataSubmittedQualified) {
                    continue;
                }

                UInt160 winningAccount = ToScripthash(entry.userKey);

                //Distribute the committed GAS Amount with a 20% bonus
                GAS.Transfer(Runtime.ExecutingScriptHash, winningAccount, entry.commitAmount + entry.commitAmount / 5, null);

                //Assign a winner's badge to the account for completing the challenge
                Contract.Call(IMPEL_NFT_TOKEN_CONTRACT_HASH, "mintAndTransfer", CallFlags.All, new object[]{tokenName, tokenDescription, tokenURL, winningAccount});
            }

            OnRewardsDistributed(challengeId);
            
            return true;
        }
    }

    class ImpelStorage
    {
        const string IMPELSC_STORAGE_CORE_DATA = "A*";
        const string IMPELSC_STORAGE_USERS = "B*";
        const string IMPELSC_STORAGE_CHALLENGES = "C*";
        const string IMPELSC_STORAGE_USER_CHALLENGES = "D*";
        
        readonly StorageMap dappData;
        readonly StorageMap usersMap;
        readonly StorageMap challengesMap;
        readonly StorageMap userChallengeMapping;

        public ImpelStorage() {
            dappData = new StorageMap(Storage.CurrentContext, IMPELSC_STORAGE_CORE_DATA);
            usersMap = new StorageMap(Storage.CurrentContext, IMPELSC_STORAGE_USERS);
            challengesMap = new StorageMap(Storage.CurrentContext, IMPELSC_STORAGE_CHALLENGES);
            userChallengeMapping = new StorageMap(Storage.CurrentContext, IMPELSC_STORAGE_USER_CHALLENGES);
        }

        public User GetUser(string userAccount) {
            string userJSON = usersMap.Get(userAccount);
            if (userJSON == null || userJSON == "") {
                return new User("");
            }
            return User.Deserialize(userJSON);
        }

        public void PutUser(string userKey, User user) => usersMap.Put(userKey, User.Serialize(user));
        
        public string GetOwner() => (string)dappData.Get("Owner") ?? "";
        
        public void PutOwner(string owner) => dappData.Put("Owner", owner);
        
        public void ResetLastChallengeId() => dappData.Put("LastChallengeId", 1);

        public void PutOracleResp(BigInteger challengeId, string key, string resp) => dappData.Put("OracleData" + key + challengeId, resp);

        public string GetOracleResp(BigInteger challengeId, string key) => dappData.Get("OracleData" + key + challengeId);

        public BigInteger GetAndIncrementLastChallengeId() {
            BigInteger lastChallengeId = (BigInteger) dappData.Get("LastChallengeId");
            dappData.Put("LastChallengeId", lastChallengeId);
            return lastChallengeId;
        }

        public Challenge GetChallenge(BigInteger challengeId) {
            string challengeJSON = challengesMap.Get((ByteString)challengeId);
            if (challengeJSON == null || challengeJSON == "") {
                return null;
            }
            return Challenge.Deserialize(challengeJSON);
        }

        public void PutChallenge(BigInteger challengeId, Challenge challenge) {
            challenge.challengeId = challengeId;
            challengesMap.Put( (ByteString)challengeId, Challenge.Serialize(challenge));
        }

        public List<Challenge> GetAllChallenges(bool isActive) {
            List<Challenge> challenges = new List<Challenge>();
            var iterator = challengesMap.Find(FindOptions.KeysOnly | FindOptions.RemovePrefix);
            while(iterator.Next()) {
                BigInteger key = new BigInteger((byte[])iterator.Value); 
                Challenge challenge = GetChallenge(key);
                if (!isActive || challenge.challengeState == Challenge.ChallengeState.ChallengeStateActive) {
                    challenges.Add(challenge);
                } else {
                    continue;
                }
            }

            return challenges;
        }

        public void AddUserChallengeRecord(BigInteger challengeId, string userKey, BigInteger amount) {

            UserChallengeEntry userChallengeRecord = new UserChallengeEntry(userKey, challengeId, (int)amount);
            string recordKey = "c#" + challengeId + userKey;
            PutChallengeEntry(recordKey, userChallengeRecord);
        }

        public UserChallengeEntry GetChallengeEntry(string key) {
            return (UserChallengeEntry) StdLib.JsonDeserialize(userChallengeMapping.Get(key));

        }

        public void PutChallengeEntry(string key, UserChallengeEntry challengeEntry) {
            string serializedEntry = StdLib.JsonSerialize(challengeEntry);
            userChallengeMapping.Put(key, serializedEntry);
        }

        public List<UserChallengeEntry> GetSubscribedEntriesForChallenge(BigInteger challengeId) {
            List<UserChallengeEntry> challengeEntries = new List<UserChallengeEntry>();
            var iterator = userChallengeMapping.Find("c#" + challengeId, FindOptions.KeysOnly | FindOptions.RemovePrefix);
            while(iterator.Next()) {
                string key = "c#" + challengeId + (string)iterator.Value;
                challengeEntries.Add(GetChallengeEntry(key));
            }

            return challengeEntries;
        }

        public List<UserChallengeEntry> GetSubscribedChallengesForUser(string userKey) {
            List<UserChallengeEntry> challengeEntries = new List<UserChallengeEntry>();
            var iterator = userChallengeMapping.Find(FindOptions.RemovePrefix);
           
            while(iterator.Next()) {
                var kvp = (object[])iterator.Value;
                string key = (string)kvp[0];

                byte[] keyArray = key.ToByteArray();
                byte[] userKeyArray = userKey.ToByteArray();
                int keyArrayLength = keyArray.Length;
                int addressBeginIndex = 0;
                int match_char_count = 0;
                bool index_matched = false;
                bool address_matched = false;
                for (int i = 0; i < keyArrayLength; i++)
                {
                    byte n_char = 0x4e;
                    if (keyArray[i] == n_char && index_matched == false) {
                        index_matched = true;
                        addressBeginIndex = i;
                    }
                    
                    if (index_matched == true) {
                        if (userKeyArray[i - addressBeginIndex] != keyArray[i]) {
                            break;
                        }

                        userKeyArray[i - addressBeginIndex] = keyArray[i];
                        match_char_count = match_char_count + 1;

                        if (match_char_count > 32) {
                            address_matched = true;
                        }
                    }
                }
                
                if (address_matched)   {
                    challengeEntries.Add(GetChallengeEntry(key));
                }
            }

            return challengeEntries;
        }

    }

    public class User {
        public string username;
        public User(string name) {
            username = name;
        }

        public static string Serialize(User user) {
            return StdLib.JsonSerialize(user);
        }

        public static User Deserialize(string json) {
            return (User) StdLib.JsonDeserialize(json);
        }

    }

    public class UserChallengeEntry {
        
        public enum UserChallengeState {
            DataNotSubmitted,
            DataSubmitted,
            DataSubmittedQualified,
            DataSubmittedNotQualified
        }
        public string userKey;
        public BigInteger challengeId;
        public int commitAmount;

        public UserChallengeState state;

        public UserChallengeEntry(string key, BigInteger challenge_id, int amount) {
            userKey = key;
            challengeId = challenge_id;
            commitAmount = amount;
            state = UserChallengeState.DataNotSubmitted;
        }
    }

    public class Challenge
    {
        public enum ChallengeState {
            ChallengeStateNotStarted,
            ChallengeStateActive,
            ChallengeStateCompleted,
            ChallengeStateEvaluationCompleted
        }

        public enum ChallengeActivityType {
            ChallengeActivityTypeWalkRun
        }

        public enum ChallengeType {
            ChallengeTypeMax,
            ChallengeTypeAggregate
        }

        public BigInteger challengeId;
        public string challengeTitle;
        public ulong challengeStartTime;
        public ulong challengeEndTime;
        public ulong challengeEvaluationTime;
        public ChallengeState challengeState;
        public ChallengeActivityType challengeActivityType;
        public ChallengeType challengeType;
        public BigInteger challengeValue;

        public Challenge(string title, ulong startTime, ulong endTime, ulong evaluationTime, ChallengeActivityType activityType, ChallengeType type, BigInteger value) {
            challengeTitle = title;
            challengeStartTime = startTime;
            challengeEndTime = endTime;
            challengeEvaluationTime = evaluationTime;
            challengeState = ChallengeState.ChallengeStateNotStarted;
            challengeActivityType = activityType;
            challengeType = type;
            challengeValue = value;
        }

        public static string Serialize(Challenge challenge) {
            return StdLib.JsonSerialize(challenge);
        }

        public static Challenge Deserialize(string json) {
            return (Challenge) StdLib.JsonDeserialize(json);
        }
    }
}
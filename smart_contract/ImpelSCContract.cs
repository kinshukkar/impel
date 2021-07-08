using System;
using System.ComponentModel;
using System.Numerics;

using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

namespace Impel
{
    [DisplayName("Impel.ImpelSCv0.1.64")]
    [ManifestExtra("Author", "Kinshuk Kar, Pompita Sarkar")]
    [ManifestExtra("Email", "kinshuk89@gmail.com")]
    [ManifestExtra("Description", "A novel motivation mechanism to assist people in getting fitter with social and financial rewards")]
    [ContractPermission("*", "onNEP17Payment")]
    [ContractTrust("0xd2a4cff31913016155e38e474a2c06d08be276cf")]

    public class ImpelSCContract : SmartContract
    {
        static readonly ImpelStorage contractData = new ImpelStorage();
        private static Transaction Tx => (Transaction) Runtime.ScriptContainer;

        static UInt160 IMPEL_NFT_TOKEN_CONTRACT_HASH = ToScripthash("NUSYZTF181S6GRoUj86iP3wSdnkeBfnMk4");        
        
        [DisplayName("_deploy")]
        public static void Deploy(object data, bool update) {
            if (!update)
            {
                initialize();
            }
        }

        private static void initialize() {

            contractData.PutOwner(ToAddress((ByteString) Tx.Sender));
            contractData.ResetLastChallengeId();
            BigInteger newChallengeId = contractData.GetAndIncrementLastChallengeId();
            Challenge dummyChallenge = Challenge.getTestChallenge();
            contractData.PutChallenge(newChallengeId, dummyChallenge);

        }

        public static void UpdateContract(ByteString nefFile, string manifest) {
            string owner = contractData.GetOwner();
            if (!ToAddress((ByteString)Tx.Sender).Equals(owner))
            {
                throw new Exception("Only the contract owner can do this");
            }
            ContractManagement.Update(nefFile, manifest, null);
        }

        public static void DestroyContract(ByteString nefFile, string manifest) {
            string owner = contractData.GetOwner();
            if (!ToAddress((ByteString)Tx.Sender).Equals(owner))
            {
                throw new Exception("Only the contract owner can do this");
            }
            ContractManagement.Destroy();
        }

        public static string ToAddress(ByteString sender) {
            var address = StdLib.Base58CheckEncode("5" + sender);
            return (address);
        }

        public static UInt160 ToScripthash(String address)
        {
            if ((address.ToByteArray())[0] == 0x4e)
            {
                var decoded = (byte[]) StdLib.Base58CheckDecode(address);
                var Scripthash = (UInt160)decoded.Last(20);
                return (Scripthash);
            }
            return null;
        }

        public static void AddChallenge(string title, ulong startTime, ulong endTime, ulong evaluationTime, Challenge.ChallengeActivityType activityType, Challenge.ChallengeType type, double value) {
            
            BigInteger newChallengeId = contractData.GetAndIncrementLastChallengeId();
            Challenge newChallenge = new Challenge(title, startTime, endTime, evaluationTime, activityType, type, value);
            contractData.PutChallenge(newChallengeId, newChallenge);
            return;
        }

        public static void UpdateChallengeState(BigInteger challengeId) {
            
            Challenge challenge = contractData.GetChallenge(challengeId);
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
            contractData.PutChallenge(challengeId, challenge);
        }
        public static void RegisterUser(string username) {
            User newUser = new User(username);
            contractData.PutUser(ToAddress((ByteString) Tx.Sender), newUser);
        }

        public static User RetrieveUser() {
            return RetrieveUserByAddress(ToAddress((ByteString) Tx.Sender));
        }

        public static User RetrieveUserByAddress(string address) {
            return contractData.GetUser(address);
        }

        public List<Challenge> GetAllChallenges() {
            return contractData.GetAllChallenges(false);
        }

        public List<Challenge> GetActiveChallenges() {
            return contractData.GetAllChallenges(true);
        }

        public List<UserChallengeEntry> GetSubscribedEntriesForChallenge(BigInteger challengeId) {
            return contractData.GetSubscribedEntriesForChallenge(challengeId);
        }

        public List<UserChallengeEntry> GetSubscribedChallengesForUser() {
            return contractData.GetSubscribedChallengesForUser(ToAddress((ByteString)Tx.Sender));
        }
        public void UpdateChallengeEntryState(BigInteger challengeId, string userKey, UserChallengeEntry.UserChallengeState state) {

            string userChallengeKey = "c#" + challengeId + userKey;
            UserChallengeEntry challengeEntry = contractData.GetChallengeEntry(userChallengeKey);
            challengeEntry.state = state;
            contractData.PutChallengeEntry(userChallengeKey, challengeEntry);
            return;
        }

        public static void OnNEP17Payment(UInt160 from, BigInteger amount, object[] data) {

            if (!Runtime.CheckWitness(from)) throw new Exception("Check your signature.");

            if (Runtime.CallingScriptHash == GAS.Hash) {
                if (data.Length == 2 && (string)data[0] == "join_challenge") {
                    BigInteger challengeId = (BigInteger) data[1];
                    contractData.AddUserChallengeRecord(challengeId, ToAddress((ByteString) from), amount);
                }
            }
        }

        public static void ValidateChallengeEntries() {
            string url = "https://raw.githubusercontent.com/kinshukkar/i-data/main/test.json";
            string filter = "";
            string callback = "fcecallback";
            long gasPrice = Oracle.MinimumResponseFee;
            FetchUserChallengeEntries(url, filter, callback, gasPrice);

        }
        public static void FetchUserChallengeEntries(string url, string filter, string callback, long gasPrice)
        {
            Runtime.Log(url);
            Runtime.Log(filter);
            Runtime.Log(callback);
            Runtime.Log("GAS" + gasPrice);
            Runtime.Log("Starting to call");
            Oracle.Request(url, filter, callback, null, gasPrice);
        }

        public static void fcecallback(string url, object data, OracleResponseCode code, string result)
        {
            Runtime.Log("Received call");
            if (Runtime.CallingScriptHash != Oracle.Hash) throw new Exception("Unauthorized!");

            Runtime.Log(code.ToString());
            if (code != OracleResponseCode.Success) throw new Exception("Oracle response failure with code " + (byte)code);

            Runtime.Log(result);
            object ret = StdLib.JsonDeserialize(result);
            object[] arr = (object[])ret;
            string value = (string)arr[0];
        }
        private static void EvaluateChallengeEntries(BigInteger challengeId, Map<String, Array> activityRecords, List<UserChallengeEntry> entries) {

            List<UserChallengeEntry> winningEntries = new List<UserChallengeEntry>();
            Challenge challenge = contractData.GetChallenge(challengeId);

            int totalChallengeCommit = 0;
            foreach (var entry in entries)
            {
                if(entry.state == UserChallengeEntry.UserChallengeState.DataNotSubmitted) {
                    continue;
                }

                totalChallengeCommit = totalChallengeCommit + entry.commitAmount;
                var records = (double[])activityRecords[entry.userKey];
                int qualified = 0;
                foreach (var record in records) {
                    if (record > challenge.challengeValue) {
                        qualified = 1;
                        break;
                    }
                }
                if (qualified == 1) {
                    entry.state = UserChallengeEntry.UserChallengeState.DataSubmittedQualified;
                    winningEntries.Add(entry);
                } else {
                    entry.state = UserChallengeEntry.UserChallengeState.DataSubmittedNotQualified;              
                }
                string entryKey = "c#" + challengeId + entry.userKey;
                contractData.PutChallengeEntry(entryKey, entry);
            }

            DistributeRewards(challengeId, winningEntries, totalChallengeCommit);
        }
        private static void DistributeRewards(BigInteger challengeId, UserChallengeEntry[] winningEntries, int totalAmount) {


            
            return;
        }

        private static void AssignNFTBadgeTokens(BigInteger challengeId, UserChallengeEntry[] winningEntries) {
            
            Challenge challenge = contractData.GetChallenge(challengeId);
            String tokenName = "Winner of " + challenge.challengeTitle;
            String tokenDescription = "Badge for " + challenge.challengeTitle;
            string tokenURL = "https://impelapp.com/images/badges/" + challengeId +".png";
            
            foreach (var entry in winningEntries)  {
                string userKey = entry.userKey;
                UInt160 userAddress = ToScripthash(userKey);
                Contract.Call(IMPEL_NFT_TOKEN_CONTRACT_HASH, "MintAndTransfer", CallFlags.All, new object[]{tokenName, tokenDescription, tokenURL, userAddress});
            }
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

        public BigInteger GetAndIncrementLastChallengeId() {
            BigInteger lastChallengeId = (BigInteger) dappData.Get("LastChallengeId");
            dappData.Put("LastChallengeId", lastChallengeId + 1);
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

            UserChallengeEntry userChallengeRecord = new UserChallengeEntry(userKey, (int)amount);
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
                Runtime.Log(key);
                challengeEntries.Add(GetChallengeEntry(key));
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
        public int commitAmount;

        public UserChallengeState state;

        public UserChallengeEntry(string key, int amount) {
            userKey = key;
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
        public string challengeTitle;
        public ulong challengeStartTime;
        public ulong challengeEndTime;
        public ulong challengeEvaluationTime;
        public ChallengeState challengeState;
        public ChallengeActivityType challengeActivityType;
        public ChallengeType challengeType;
        public double challengeValue;

        public Challenge(string title, ulong startTime, ulong endTime, ulong evaluationTime, ChallengeActivityType activityType, ChallengeType type, double value) {
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

        public static Challenge getTestChallenge()  {
            Challenge newChallenge = new Challenge("June 5K Challenge", 1624559400000, 1624991400000, 1625164200000, ChallengeActivityType.ChallengeActivityTypeWalkRun, ChallengeType.ChallengeTypeMax, 5);
            return newChallenge;
        }
    }
}
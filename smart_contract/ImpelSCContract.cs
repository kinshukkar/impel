﻿using System;
using System.ComponentModel;
using System.Numerics;

using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

namespace ImpelSC
{
    [DisplayName("Impel.ImpelSCv0.1.2")]
    [ManifestExtra("Author", "Kinshuk Kar, Pompita Sarkar")]
    [ManifestExtra("Email", "kinshuk89@gmail.com")]
    [ManifestExtra("Description", "A novel motivation mechanism to assist people in getting fitter with social and financial rewards")]
    public class ImpelSCContract : SmartContract
    {
        static readonly ImpelStorage contractData = new ImpelStorage();
        private static Transaction Tx => (Transaction) Runtime.ScriptContainer;

        [DisplayName("_deploy")]
        public static void Deploy(object data, bool update) {
            if (!update)
            {
                initialize();
            }
        }
        private static void initialize() {

            contractData.PutOwner((ByteString) Tx.Sender);
            contractData.ResetLastUserId();
            contractData.ResetLastChallengeId();
            int newChallengeId = contractData.GetAndIncrementLastChallengeId();
            Challenge dummyChallenge = Challenge.getTestChallenge();
            contractData.AddChallenge(newChallengeId, dummyChallenge);
        }
        public static void UpdateContract(ByteString nefFile, string manifest) {
            ByteString owner = contractData.GetOwner();
            if (!Tx.Sender.Equals(owner))
            {
                throw new Exception("Only the contract owner can do this");
            }
            ContractManagement.Update(nefFile, manifest, null);
        }

        public static void DestroyContract(ByteString nefFile, string manifest) {
            ByteString owner = contractData.GetOwner();
            if (!Tx.Sender.Equals(owner))
            {
                throw new Exception("Only the contract owner can do this");
            }
            ContractManagement.Destroy();
        }

        public static void RegisterUser(string username) {
            int newUserId = contractData.GetAndIncrementLastUserId();
            User newUser = new User(Tx.Sender, username);
            contractData.PutUser(newUserId, newUser);
        }

        public static User RetrieveUser() {
            return contractData.GetUser(Tx.Sender);
        }

        public static void onNEP17Payment(UInt160 from, BigInteger amount, object[] data) {

        }
    }

    class ImpelStorage
    {
        readonly StorageMap dappData;
        readonly StorageMap usersMap;
        readonly StorageMap challengesMap;

        public ImpelStorage() {
            dappData = new StorageMap(Storage.CurrentContext, "ImpelSC.Storage.CoreData");
            usersMap = new StorageMap(Storage.CurrentContext, "ImpelSC.Storage.Users");
            challengesMap = new StorageMap(Storage.CurrentContext, "ImpelSC.Storage.Challenges");
        }

        public User GetUser(UInt160 userAccount) {
            Iterator results = usersMap.Find( StdLib.Itoa((BigInteger)userAccount), FindOptions.ValuesOnly);
            string userJSON = null;
            do {
                userJSON = (string) results.Value;
                break;
            } while (results.Next());
            return (User) StdLib.JsonDeserialize(userJSON);
        }
        public void PutUser(int userId, User user) => usersMap.Put(StdLib.Itoa(userId, 10), StdLib.JsonSerialize(user));
        public string GetOwner() => (ByteString)dappData.Get("Owner") ?? "";
        public void PutOwner(ByteString owner) => dappData.Put("Owner", (ByteString)owner);
        public void ResetLastChallengeId() => dappData.Put("LastChallengeId", 1);

        public int GetAndIncrementLastChallengeId() {
            int lastChallengeId = (int) StdLib.Atoi(dappData.Get("LastChallengeId"));
            lastChallengeId++;
            dappData.Put("LastChallengeId", lastChallengeId);
            return lastChallengeId;
        }
        public void AddChallenge(int challengeId, Challenge challenge) {
            challengesMap.Put( StdLib.Itoa(challengeId, 10) , Challenge.Serialize(challenge));
        }

        public void ResetLastUserId() => dappData.Put("LastUserId", 1);

        public int GetAndIncrementLastUserId() {
            int lastUserId = (int) StdLib.Atoi(dappData.Get("LastUserId"));
            lastUserId++;
            dappData.Put("LastUserId", lastUserId);
            return lastUserId;
        }

    }

    public class User
    {
        private UInt160 userAccount; 
        private string username;

        public User(UInt160 account, string name) {
            userAccount = account;
            username = name;
        }

        public static string Serialize(User user) {
            return StdLib.JsonSerialize(user);
        }

        public static User Deserialize(string json) {
            return (User) StdLib.JsonDeserialize(json);
        }

    }
    class Challenge
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
            ChallengeTypeMax
        }
        private string challengeTitle;
        private ulong challengeStartTime;
        private ulong challengeEndTime;
        private ulong challengeEvaluationTime;
        private ChallengeState challengeState;
        private ChallengeActivityType challengeActivityType;
        private ChallengeType challengeType;
        private int challengeValue;

        public Challenge(string title, ulong startTime, ulong endTime, ulong evaluationTime, ChallengeActivityType activityType, ChallengeType type, int value) {
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
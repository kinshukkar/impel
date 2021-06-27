using System;
using System.ComponentModel;
using System.Numerics;

using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;

namespace ImpelSC
{
    [DisplayName("Impel.ImpelSCv0.1")]
    [ManifestExtra("Author", "Kinshuk Kar, Pompita Sarkar")]
    [ManifestExtra("Email", "kinshuk89@gmail.com")]
    [ManifestExtra("Description", "A novel motivation mechanism to assist people in getting fitter with social and financial rewards")]
    public class ImpelSCContract : SmartContract
    {
        private static StorageMap ContractStorage => new StorageMap(Storage.CurrentContext, "ImpelSCContract");
        private static StorageMap ContractMetadata => new StorageMap(Storage.CurrentContext, "Metadata");
        private static Transaction Tx => (Transaction) Runtime.ScriptContainer;

        [DisplayName("_deploy")]
        public static void Deploy(object data, bool update)
        {
            if (!update)
            {
                ContractMetadata.Put("Owner", (ByteString) Tx.Sender);
            }
        }

        public static void UpdateContract(ByteString nefFile, string manifest)
        {
            ByteString owner = ContractMetadata.Get("Owner");
            if (!Tx.Sender.Equals(owner))
            {
                throw new Exception("Only the contract owner can do this");
            }
            ContractManagement.Update(nefFile, manifest, null);
        }

        public static void DestroyContract(ByteString nefFile, string manifest)
        {
            ByteString owner = ContractMetadata.Get("Owner");
            if (!Tx.Sender.Equals(owner))
            {
                throw new Exception("Only the contract owner can do this");
            }
            ContractManagement.Destroy();
        }
    }
}
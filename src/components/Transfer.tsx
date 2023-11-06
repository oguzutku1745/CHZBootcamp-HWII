import { getNFTContract } from "@/util/getContracts";
import { getMarketplaceAddress } from "@/util/getContractAddress";
import { useState, type FC } from "react";
import { useValidDirectListings, useContract } from "@thirdweb-dev/react";



interface TransferNFTCardProps {
    id: string;
}

const TransferCard: FC<TransferNFTCardProps> = ({ id }) => {

    const {contract:marketplace} = useContract(getMarketplaceAddress(),"marketplace-v3")
    const {data:directListings, isLoading} = useValidDirectListings(marketplace, {
        start:0,
        count:100
    })

    console.log(directListings)

    const [message, setMessage] = useState("")
    const [address, setAddress] = useState("")
    const {nft_contract} = getNFTContract();

    const handleAddresChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const handleTransfer = async () => {
        try{
            if(nft_contract){

            if (listingCondition(directListings, id)) {
                await nft_contract.erc721.transfer(address, id);
                console.log("Transfer successful");
            }
        }
        } catch(e) {
            console.log("Error Transfer")
        }
       
    };

    const listingCondition = (directListings:any, id:any) => {

            const isListed = directListings.some((listing:any) => listing.id === id)
            if (isListed) {
                setMessage("Cancel the listing before transfering it")
                throw new Error('NFT is already listed. Transfer is not allowed.');
            }

            return true;

    }

    return (
        <div className="relative bg-gray-800 text-white p-6 rounded-lg w-6/12 shadow-md mt-4">
            <h1 className="text-2xl font-semibold mb-2 ">Transfer NFT</h1>

            <div>
                <label className="font-bold text-xl">Recepient</label>
                <input
                    className=" ml-2 bg-gray-800 w-20"
                    placeholder="Address"
                    type="text"
                    value={address}
                    onChange={handleAddresChange}
                />
            </div>
        { nft_contract && (
            <button
            onClick={handleTransfer}
            className="mt-4 bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Send
            </button>
        )}
        {(message as unknown as boolean) ? (
            <div className="text-center mt-4">{message}</div>
        ): null}    
        </div>
    );
};
export default TransferCard;

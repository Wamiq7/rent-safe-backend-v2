const web3 = require('../config/web3Config');
const contractAddress = "0x10f0490Ec05887AfFab6f60839f47315C69F71f9";
const ABIPropery = require('../artifacts/contracts/PropertyListing.sol/PropertyListing.json');
const contract = new web3.eth.Contract(ABIPropery.abi, contractAddress);

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

const getAllProperties = async (req, res) => {
    try {
        const data = await contract.methods.getAllProperties().call();
        const transformedData = data.map((item) => ({
            propertyId: Number(item.propertyId),
            propertyAddress: item.propertyAddress,
            cityArea: item.cityArea,
            floor: Number(item.floor),
            ownerWallet: item.ownerWallet,
            stateAgent: item.stateAgent,
            status: Number(item.status),
            delistApproved: item.delistApproved,
            imageLinks: item.imageLinks,
            description: item.description,
            propertyType: item.propertyType,
            listingDate: formatDate(Number(item.listingDate)),
        }));
        res.status(200).json(transformedData);

    }
    catch (err) {
        res.status(500).json({ message: "Not Found" })
        console.log(err);
    }

}

const getRecentlyListedProperties = async (req, res) => {
    try {
        const data = await contract.methods.getAllProperties().call();
        const lastIndex = data.length - 1; // Index of the last element in the array
        const startSliceIndex = Math.max(lastIndex - 5 + 1, 0); // Calculate the start index for the slice

        const limitedData = data.slice(startSliceIndex);
        const transformedData = limitedData.map((item) => ({
            propertyId: Number(item.propertyId),
            propertyAddress: item.propertyAddress,
            cityArea: item.cityArea,
            floor: Number(item.floor),
            ownerWallet: item.ownerWallet,
            stateAgent: item.stateAgent,
            status: Number(item.status),
            delistApproved: item.delistApproved,
            imageLinks: item.imageLinks,
            description: item.description,
            propertyType: item.propertyType,
            listingDate: formatDate(Number(item.listingDate)),
        }));
        res.status(200).json(transformedData);

    }
    catch (err) {
        res.status(500).json({ message: "Not Found" })
        console.log(err);
    }

}
const getProperty = async (req, res) => {
    try {
        const data = await contract.methods.getPropertyDetails(req.params.id).call();
        const transformedData = {
            propertyAddress: data.propertyAddress,
            cityArea: data.cityArea,
            floor: Number(data.floor),
            ownerWallet: data.ownerWallet,
            stateAgent: data.stateAgent,
            status: Number(data.status),
            delistApproved: data.delistApproved,
            imageLinks: data.imageLinks,
            description: data.description,
            propertyType: data.propertyType,
        }
        res.status(200).json(transformedData)
    }
    catch (err) {
        res.status(500).json({ message: "Not Found" })
        console.log(err);
    }

}
module.exports = {
    getAllProperties,
    getProperty,
    getRecentlyListedProperties

}
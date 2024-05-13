const web3 = require('../config/web3Config');
const ABIProperty = require('../artifacts/contracts/PropertyListing.sol/PropertyListing.json');
const ABIRegistration = require('../artifacts/contracts/RegistrationContract.sol/RegistrationContract.json');

const propertyContract = new web3.eth.Contract(ABIProperty.abi, "0x10f0490Ec05887AfFab6f60839f47315C69F71f9");
const registrationContract = new web3.eth.Contract(ABIRegistration.abi, process.env.REGISTRATION);

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
const transformUser = (user) => {
    const name = user.name;
    const cnic = user.cnic;
    const estateName = user.estateName;
    const displayPicture = user.displayPicture;
    return ({ name, cnic, estateName, displayPicture })
}
const getAllProperties = async (req, res) => {
    try {
        const data = await propertyContract.methods.getAllProperties().call();
        const transformedData = await Promise.all(data.map(async (item) => {
            const userData = await registrationContract.methods.users(item.stateAgent).call();

            return {
                propertyId: Number(item.propertyId),
                propertyAddress: item.propertyAddress,
                cityArea: item.cityArea,
                floor: Number(item.floor),
                ownerWallet: item.ownerWallet,
                stateAgent: item.stateAgent,
                estateName: userData.estateName,
                status: Number(item.status),
                delistApproved: item.delistApproved,
                imageLinks: item.imageLinks,
                description: item.description,
                propertyType: item.propertyType,
                thumbnail: item.thumbnail,
                listingDate: formatDate(Number(item.listingDate)),
            };
        }));
        res.status(200).json(transformedData);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const getRecentlyListedProperties = async (req, res) => {
    try {
        const data = await propertyContract.methods.getAllProperties().call();

        const lastIndex = data.length - 1; // Index of the last element in the array
        const startSliceIndex = Math.max(lastIndex - 5 + 1, 0); // Calculate the start index for the slice

        const limitedData = data.slice(startSliceIndex);
        const transformedData = await Promise.all(limitedData.map(async (item) => {
            const userData = await registrationContract.methods.users(item.stateAgent).call();

            return {
                propertyId: Number(item.propertyId),
                propertyAddress: item.propertyAddress,
                cityArea: item.cityArea,
                floor: Number(item.floor),
                ownerWallet: item.ownerWallet,
                stateAgent: item.stateAgent,
                estateName: userData.estateName,
                status: Number(item.status),
                delistApproved: item.delistApproved,
                imageLinks: item.imageLinks,
                description: item.description,
                propertyType: item.propertyType,
                thumbnail: item.thumbnail,
                listingDate: formatDate(Number(item.listingDate)),
            };
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
        const data = await propertyContract.methods.getPropertyDetails(req.params.id).call();
        const userData = await registrationContract.methods.users(data.stateAgent).call();

        const transformedData = {
            propertyAddress: data.propertyAddress,
            cityArea: data.cityArea,
            floor: Number(data.floor),
            ownerWallet: data.ownerWallet,
            stateAgent: data.stateAgent,
            stateAgentDetails: transformUser(userData),
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
const web3 = require('../config/web3Config');
const ABIAgreement = require('../artifacts/contracts/RentalAgreement.sol/RentalAgreement.json');
const ABIProperty = require('../artifacts/contracts/PropertyListing.sol/PropertyListing.json');
const ABIRegistration = require('../artifacts/contracts/RegistrationContract.sol/RegistrationContract.json');

const rentalContract = new web3.eth.Contract(ABIAgreement.abi, process.env.RENTAL_AGREEMENT);
const propertyContract = new web3.eth.Contract(ABIProperty.abi, process.env.PROPERTY);
const registrationContract = new web3.eth.Contract(ABIRegistration.abi, process.env.REGISTRATION);



const getAllAgreements = async (req, res) => {
    try {
        const data = await rentalContract.methods.getAllAgreementsWithDetails().call();
        const transformedData = await Promise.all(data.map(async (item) => {
            const userData = await registrationContract.methods.users(item.stateAgent).call();
            const property = await propertyContract.methods.getPropertyDetails(Number(item.propertyId)).call();

            return ({
                agreementId: Number(item.agreementId),
                propertyId: Number(item.propertyId),
                rentAmount: Number(item.rentAmount),
                durationMonths: Number(item.durationMonths),
                status: Number(item.status),
                estateName: userData.estateName,
                thumbnail: property.thumbnail
            });
        }));
        res.status(200).json(transformedData);

    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
        console.error(err);
    }
}

const transformUser = (user) => {
    const name = user.name;
    const cnic = user.cnic;
    const estateName = user.estateName;
    const displayPicture = user.displayPicture;
    return ({ name, cnic, estateName, displayPicture })
}

const transformProperty = (data) => {

    return {
        propertyAddress: data.propertyAddress,
        cityArea: data.cityArea,
        floor: Number(data.floor),
        propertyType: data.propertyType,
        thumbnail: data.thumbnail,
        description: data.description
    }
}

const getAgreementById = async (req, res) => {
    try {
        const data = await rentalContract.methods.agreements(req.params.id).call();
        const property = await propertyContract.methods.getPropertyDetails(Number(data.propertyId)).call();
        const stateAgent = await registrationContract.methods.users(data.stateAgent).call();
        const landlord = await registrationContract.methods.users(data.landlord).call();
        const tenant = await registrationContract.methods.users(data.tenant).call();

        const transformedData = {
            agreementId: Number(data.agreementId),
            landlord: transformUser(landlord),
            tenant: transformUser(tenant),
            stateAgent: transformUser(stateAgent),
            propertyId: Number(data.propertyId),
            propertyDetails: transformProperty(property),
            rentAmount: Number(data.rentAmount),
            durationMonths: Number(data.durationMonths),
            advancePayment: Number(data.advancePayment),
            startTime: Number(data.startTime),
            status: Number(data.status),
            landlordApprovalForCancellation: data.landlordApprovalForCancellation,
            tenantApprovalForCancellation: data.tenantApprovalForCancellation,
            extraDetail: data.extraDetail
        }
        res.status(200).json(transformedData)
    }
    catch (err) {
        res.status(500).json({ message: "Not Found" })
        console.log(err);
    }

}
module.exports = {
    getAllAgreements,
    getAgreementById

}




const web3 = require('../config/web3Config');
const ABIRegistration = require('../artifacts/contracts/RegistrationContract.sol/RegistrationContract.json');
const contract = new web3.eth.Contract(ABIRegistration.abi, process.env.REGISTRATION);


const viewUserDetailsByWalletAddress = async (req, res) => {
    try {
        console.log(process.env.REGISTRATION);
        const task = await contract.methods.users(req.params.address).call();
        const name = task.name;
        const cnic = task.cnic;
        const role = Number(task.role);
        const estateName = task.estateName;
        const email = task.email;
        const cnicImage = task.cnicImage;
        const phone = task.phoneNumber;
        const displayPicture = task.displayPicture;

        res.status(200).json({ name, cnic, role, estateName, email, cnicImage, phone, displayPicture })
    }
    catch (err) {
        res.status(500).json({ message: "No user found against this wallet address" })
        console.log(err);
    }

}
module.exports = {
    viewUserDetailsByWalletAddress
}
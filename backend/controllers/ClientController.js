import ClientModel from "../models/ClientModel.js";

// Data Display
const getAllClients = async (req, res, next) => {
    let Clients;

    try {
        Clients = await ClientModel.find();
    } catch (err) {
        console.log(err);
    }

    if (!Clients) {
        return res.status(404).json({ message: "Client Not Found!" });
    }

    return res.status(200).json({ Clients });
};

//Data Insert
const addClients = async (req, res, next) => {

    const {name,address,email,contact} = req.body;

    let Clients;

    try{
        Clients = new Client({name,address,email,contact});
        await Clients.save();
    }catch (err) {
        console.log(err);
    }
    //If not insert clients
    if(!Clients){
        return res.status(404).send({message:"Unable to add clients"});
    }
    return res.status(200).json({ Clients
    });

}

//Get by Id
const getById = async (req, res, next) => {

    const id = req.params.id;

    let Clients;

    try{
        Clients = await Client.findById(id);
    }catch (err){
        console.log(err);
    }
    //Not available clients
    if(!Clients){
        return res.status(404).send({message:"Client not found!"});
    }
    return res.status(200).json({ Clients
    });
}

//Update Client Details
const updateClient = async(req, res, next) => {

    const id = req.params.id;
    const {name,address,email,contact} = req.body;

    let Clients;

    try{
        Clients = await Client.findByIdAndUpdate(id,
            {name:name, address:address, email:email, contact:contact});
            Clients = await Client.save();
    }catch(err) {
        console.log(err);
    }
    if(!Clients){
        return res.status(404).json({message:"Unable to Update Client Details!"});
    }
    return res.status(200).json({ Clients});

}

//Delete Client Details

const deleteClient = async(req, res, next) => {

    const id = req.params.id;

    let Clients;

    try{
        Clients = await Client.findByIdAndDelete(id)
    }catch(err) {
        console.log(err);
    }
    if(!Clients){
        return res.status(404).json({message:"Unable to Delete Client Details!"});
    }
    return res.status(200).json({Clients});

};

export default {
    getAllClients,
    addClients,
    getById,
    updateClient,
    deleteClient
};

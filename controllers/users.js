const{request, response}=require('express')
const charactersModel = require('../models/users');
const pool=require('../db');


const CharacterList=async(req = request,res =response )=>{
    let conn;

    try {
         conn = await pool.getConnection();

       const personajes = await conn.query(charactersModel.getAll,(err)=>{
        if(err){
            throw new Error(err);
        }
       })
        
       res.json(personajes);

    } catch (error){
        console.log(error);
        res.status(500).json(error);
        
    } finally {
        if (conn) conn.end();
    }
}

const listCharacterByID=async(req = request,res =response )=>{
    const{id}=req.params;
    if (isNaN(id)){
        res.status(400).json({msg:'Invalid ID'});
        return;
    }

    let conn;

    try {
         conn = await pool.getConnection();

       const [user] = await conn.query(charactersModel.getByID,[id],(err)=>{
        if(err){
            throw new Error(err);
        }
       })

       if(!user){
        res.status(404).json({msg: 'Character not found'});
        return;
       }
        
       res.json(user);

    } catch (error){
        console.log(error);
        res.status(500).json(error);
        
    } finally {
        if (conn) conn.end();
    }
}

const addCharacter = async (req =request, res = response)=>{
    const {
        Nombre,
        LocateInGame,
        CondicionRecluta,
        Genero,
        Info_Activa=1
    } = req.body;

    if (!Nombre || !LocateInGame|| !CondicionRecluta|| !Genero|| !Info_Activa){
        res.status(400).json({msg:'Missing information'});
        return;
    }


    const user = [
        Nombre, 
        LocateInGame, 
        CondicionRecluta, 
        Genero, 
        Info_Activa
    ];

    let conn;

    try{
        conn= await pool.getConnection();

        const [CharacterName]= await conn.query(
            charactersModel.getByName,
            [Nombre],
            (error)=>{if(err) throw err;}
            
            );

            if (CharacterName){
                res.status(409).json({msg:`Character with name ${Nombre} already exist`});
                return;
            }

            

        const CharacterAdded=await conn.query(charactersModel.addRow,[...user],(err)=>{
            if(err)throw err;
        })

        if(CharacterAdded.affectedRows===0) throw new Error({msg:'Failed to add character'});

        res.json({msg:'Character added succesfully'});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn)conn.end();
    }
}

const updateCharacter = async (req,res)=>{
    const {
        Nombre,
        LocateInGame,
        CondicionRecluta,
        Genero,
        Info_Activa
    } =req.body;

    const{id} = req.params;


    let newCharacterData=[
        Nombre,
        LocateInGame,
        CondicionRecluta,
        Genero,
        Info_Activa
    ];

    let conn;

    try{
        conn=await pool.getConnection();

        const[CharacterExists]=await conn.query(
            charactersModel.getByID,
            [id],
            (err)=>{if(err)throw err;}
        );

        if(!CharacterExists||CharacterExists.is_active===0){
            res.status(404).json({msg:'Character not found'});
            return;
        }

        const [CharacterName]= await conn.query(
            charactersModel.getByName,
            [Nombre],
            (error)=>{if(err) throw err;}
            
            );

            if (CharacterName){
                res.status(409).json({msg:`Character with this name ${Nombre} already exist`});
                return;
            }


                const oldCharacterData=[
                    CharacterExists.Nombre,
                    CharacterExists.LocateInGame,
                    CharacterExists.CondicionRecluta,
                    CharacterExists.Genero,
                    CharacterExists.Info_Activa
                ];
        
                newCharacterData.forEach((CharacterData, index)=>{
                 if(!CharacterData){
                    newCharacterData[index]=oldCharacterData[index];
                 }
                })

                const CharacterUpdated=await conn.query(
                    charactersModel.updateRow,
                    [...newCharacterData, id],
                    (err)=>{if(err)throw err;}
                );
                if (CharacterUpdated.affectedRows===0){
                    throw new Error('Character not updated');
                }

                res.json({msg:'Character updated successfully'});

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn)conn.end();
    }
 
    
}

const deleteCharacter = async (req=request, res= respone)=> {
    let conn;

    try{
        conn=await pool.getConnection();
        const {id}= req.params;

        const [CharacterExists] = await conn.query(
            charactersModel.getByID,
            [id],
            (err)=>{if(err) throw err;}
        );

        if (!CharacterExists|| CharacterExists.Info_Activa === 0){
            res.status(404).json({msg:'Character not found'});
            return;
        }

        const CharacterDeleted= await conn.query(
            charactersModel.deleteRow,
            [id],
            (err)=>{if(err)throw err;}
        );

        if (CharacterDeleted.affectedRows===0) {
            throw new Error({msg:'Failed to delete character'});
        };

        res.json({msg:'Character deleted succesfully'});

    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn)conn.end();
    }
            
    }

    

module.exports={
    CharacterList, 
    listCharacterByID, 
    addCharacter, 
    updateCharacter, 
    deleteCharacter,
};
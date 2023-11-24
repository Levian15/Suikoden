const{Router}=require('express');
const{CharacterList,listCharacterByID,addCharacter,updateCharacter,deleteCharacter, }=require('../controllers/users');

const router = Router();

//http://localhost:3000/api/v1/users/
router.get('/',CharacterList);
router.get('/:id',listCharacterByID,);
router.put('/',addCharacter);
router.patch('/:id',updateCharacter);
router.delete('/:id',deleteCharacter);
//router.put('/',usersList);
//router.patch('/',usersList);
//router.delete('/',usersList);

module.exports=router;
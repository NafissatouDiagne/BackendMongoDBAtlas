const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017';
const dbName = 'my_db';
const Thing= require('./thing');
const Register = require('./register')

const { body, validationResult}=require('express-validator')//npm install express-validator

app.use(cors());
app.options('*', cors());
mongoose.connect('mongodb+srv://celeste:celeste19@cluster0.ewmqhej.mongodb.net/comments?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world');
});
/**
 * Register
 */
app.post('/api/register',async(req,res,next)=>{
const error = validationResult(req);

if(!error.isEmpty()){
  return res.status(400).json({error:error.array()})
}
else{
  delete req.body._id;
   const register = new Register({
    ...req.body
   });
   await register.save()
   .then(()=>res.status(201).json({message:'Utilisateur ajouter avec succes'}))
   .catch(error=>res.status(400).json({error}));
}
});
app.get('/api/user',(req,res,next)=>{
   Register.find()
   .then(regis=>res.status(200).json(regis))
   .catch(error=>res.status(400).json({error}));
});
/**
 * End Register
 */

/**
 * Login
 */

app.post('/api/login',async(req,res,next)=>{
  const {username,password}=req.body;
  try{
    //Verification
    const user = await Register.findOne({username});
    console.log('username', username)
    if(!user){

      return res.status(401).json({message:'Utilisateur introuvable'});
    }
    //verification du mot de passe
    const passwordMatch = await bcrypt.compare(password,user.password);
    if(!passwordMatch){
      return res.status(401).json({message:'Mot de passe incorrecte'});

    }
    // si tout est correcte
  return res.status(200).json({ message: 'Connexion réussie' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }

});


/**
 * 
 * EndLogin
 */
app.post('/api/data',async(req,res,next)=>{
   const errors= validationResult(req);

   if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
   }
   else{ delete req.body._id;
    const thing= new Thing({
      ...req.body
    });
  await thing.save()
  .then(()=>res.status(201).json({ message:'Donnee enregistrer'}))
  .catch(err=>res.status(400).json({err}));
  }
  });
  app.get('/api/datas',(req,res,next)=>{
    Thing.find()
    .then(things=>res.status(200).json(things))
    .catch(error=>res.status(400).json({error}))
  });
  
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Importer le module express
const express = require('express');
// Importer le module mongoose
const mongoose = require('mongoose');
// ================================================
// Connexion à la base de données
// ================================================
// Quand je suis connecté à la bdd (evenementiel)
mongoose.connection.once('open', () => {
    console.log("Connexion à la base de données effectué");
});

// Quand la bdd aura des erreurs
mongoose.connection.on('error', () => {
    console.log("Erreur dans la BDD");
});


// Se connecter sur mongodb (async)
// Ca prend x temps à s'executer
mongoose.connect("mongodb://127.0.0.1:27017/db_article");

// Creer le modèle article

// Instancier le sereur grace à express
const app = express();

// autoriser le back a recevoir des donées dans le body
app.use(express.json());

// ===============================================================
// ================================================
// Les routes (url/point d'entrée)
// ================================================



// Creer le modèle Article
const Article = mongoose.model('Article', { title: String, content: String, author: String }, 'articles');

// une route / un point d'entrée
app.get('/articles', async (request, response) => {
    //recuperer toyt les produits dans mongo
    // Attention asynchrome
    const articles = await Article.find();

   // RG-001 : Sinon la liste des produits
    return response.json(articles);
});


// URL  GET BY ID
app.get('/article/:id', async (request, response) => {
    /// Récupérer le param de l'url
   const idParam = request.params.id;

   // Récupérer dans la base, le produit avec l'id saisie
   const foundArticle = await Article.findOne({'_id' : idParam});

    // RG-002 : Si l'id n'existe pas en base code 705
   if(!foundArticle){
    return response.json({ code : "702"});
   }

   // RG-002 : Sinon on retourne le produit trouvé

   return response.json(foundArticle);
});

app.post('/save-article', async (request, response) => {
    const articleJson = request.body
    



  //envoyer  le produt Json dans mongodb
    // -- iNStancier le modele prooduct avec les données
    const article = new Article(articleJson);

    // -- Persister en base (envoyer dans la BDD)
    await article.save();
    
    // retourner un json
    return response.json(article);

});




app.delete('/articles/:id', async (request, response) => {
        /// Récupérer le param de l'url
       const idParam = request.params.id;
    
       // Récupérer dans la base, le produit avec l'id saisie
       const foundArticle = await Article.findOne({'_id' : idParam});
    
        // RG-002 : Si l'id n'existe pas en base code 705
       if(!foundArticle){
        return response.json({ code : "702"});
       }
    
       // RG-002 : Sinon on retourne le produit trouvé
       await Article.deleteOne({'_id' : idParam});
    
       return response.json(foundArticle);
    });



// ================================================
// Lancer le serveur
// ================================================
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});
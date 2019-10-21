
const neo4j = require('neo4j-driver').v1;
const env = require('./env.js');

export default class Api{
  constructor(){
    //super();
    this.driver = neo4j.driver(env.database, neo4j.auth.basic(env.user, env.password));
  }

  close(){
    this.driver.close();
  }

  createDatabase(){
    this.session = this.driver.session();
    let createPromise=this.session.run(
      `CREATE CONSTRAINT ON (p:Note) ASSERT p.title IS UNIQUE
      CREATE CONSTRAINT ON (a)-[r:Cause {polarity: '+'}]->(b) ASSERT r.polarity IS UNIQUE`,
      {});
    createPromise.then(result=>{
    this.session.close();
      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      console.log(node.properties);
      this.session.close();
    });
  }

  createNoteRelation(node){
    this.session = this.driver.session();

    let relationList='MERGE (a:Note {definition:$definition, title:$title, notes:$notes}) ';
    let subjectList='';
    for(let i=0; i<node.relations.length; i++){
      relationList+= `MERGE (a)-[r${i}:${node.relations[i].type}]->(s${i}) `;
      subjectList+=`MERGE (s${i}:Note {title: '${node.relations[i].subject}'}) `
    }
    let create = `${subjectList} ${relationList} RETURN a`;
    console.log(create);
    let createPromise=this.session.run(
      create,
      node);
    createPromise.then(result=>{
    this.session.close();
      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      console.log(node.properties);
      this.session.close();
    });
  }
}
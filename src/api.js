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
       CREATE CONSTRAINT ON (p1:Subject) ASSERT p1.title IS UNIQUE
       CREATE CONSTRAINT ON (p2:Course) ASSERT p2.title IS UNIQUE
       CREATE CONSTRAINT ON (p3:Theory) ASSERT p3.title IS UNIQUE
       CREATE CONSTRAINT ON (p4:Observation) ASSERT p4.title IS UNIQUE
      CREATE CONSTRAINT ON (a)-[r:Cause {polarity: '+'}]->(b) ASSERT r.polarity IS UNIQUE`,
      {});
    let relationDictionary={
      
      causes:{polarity:true},
      correlates:{polarity:true},
      evidences:{polarity:true},
      proves:{polarity:true},
      predicts:{polarity:true},

      studied:{},
      believed:{},
    };
    let entityDictionary={
      Note:{title:'',definition:'', notes:''},
      Subject:{title:'', definition:''},
      Class:{courseCode:'', sectionCode:'', termCode:''},
      Term:{code:'', startTime:Date.now(), endTime:Date.now()},
      Person:{name:'', born:Date.now(), died:Date.now()}
    }
    createPromise.then(result=>{
    this.session.close();
      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      console.log(node.properties);
      this.session.close();
    });
  }

  listNotes(){
    this.session=this.driver.session();
    let queryPromise=this.session.run(
      `MATCH (n:Note) RETURN n`,{}
    );
    queryPromise.then(result=>{
      console.log(result.records);
    })
  }

  suggestRelations(){

  }

  suggestSubjects(){
    
  }

  createNoteRelation(node){
    this.session = this.driver.session();

    let relationList='MERGE (a:Note {definition:$definition, title:$title, notes:$notes, created:$created}) ';
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
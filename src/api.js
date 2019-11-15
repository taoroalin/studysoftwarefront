const neo4j = require('neo4j-driver').v1;
const env = require('./env.js');

export default class Api {
  constructor() {
    //super();
    this.driver = neo4j.driver(env.database, neo4j.auth.basic(env.user, env.password));
  }

  close() {
    this.driver.close();
  }

  createDatabase() {
    this.session = this.driver.session();
    let createPromise = this.session.run(
      `CREATE CONSTRAINT ON (p:Note) ASSERT p.title IS UNIQUE;
       CREATE CONSTRAINT ON (p3:Theory) ASSERT p3.title IS UNIQUE;
       CREATE CONSTRAINT ON (p4:Observation) ASSERT p4.title IS UNIQUE;
       CREATE CONSTRAINT ON ()-[r:Cause]->() ASSERT exists(r.polarity);
       CREATE CONSTRAINT ON ()-[r:Correlate]->() ASSERT exists(r.polarity);
       CREATE CONSTRAINT ON ()-[r:Predict]->() ASSERT exists(r.polarity);
       CREATE CONSTRAINT ON ()-[r:Support]->() ASSERT exists(r.polarity);`,
      {});
    /*
           CREATE CONSTRAINT ON (p0:Term) ASSERT p0.title IS UNIQUE
     CREATE CONSTRAINT ON (p1:Subject) ASSERT p1.title IS UNIQUE
     CREATE CONSTRAINT ON (p2:Course) ASSERT p2.title IS UNIQUE
     CREATE INDEX ON :Note(title)
    */
    let relationDictionary = {

      Cause: { polarity: true, notes: '' },
      Correlate: { polarity: true },
      Support: { polarity: true },
      Prove: { polarity: true },
      Predict: { polarity: true },

      studied: {},
      believed: {},
    };
    let entityDictionary = {
      Note: { title: '', definition: '', notes: '' },
      Subject: { title: '', definition: '' },
      Class: { courseCode: '', sectionCode: '', termCode: '' },
      Term: { code: '', startTime: Date.now(), endTime: Date.now() },
      Person: { name: '', born: Date.now(), died: Date.now() }
    }
    createPromise.then(result => {
      this.session.close();
      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      console.log(node.properties);
      this.session.close();
    });
  }

  listNotes() {
    this.session = this.driver.session();
    let queryPromise = this.session.run(
      `MATCH (n:Note) RETURN n`, {}
    );
    queryPromise.then(result => {
      console.log(result.records);
    });
  }

  suggestRelations(req, callback) {
    this.session = this.driver.session();
    let queryPromise = this.session.run(
      `MATCH ()-[r]->() 
      WHERE type(r) =~ {r}
      RETURN DISTINCT type(r) LIMIT {l}`,
      { r: '(?i)' + req.relation + '.*', l: req.max }
    );
    queryPromise.then(result => {
      let stringList = [];
      for (let i = 0; i < result.records.length; i++) {
        stringList.push(result.records[i].get(0))
      }
      callback(stringList);
      console.log("suggested relations", stringList);
    });
  }

  suggestSubjects(req, callback) {
    this.session = this.driver.session();
    let queryPromise = this.session.run(
      `MATCH (n:Movie) 
      WHERE n.title =~ {r}
      RETURN DISTINCT n.title LIMIT {l}`,
      { r: '(?i)' + req.subject + '.*', l: req.max }
    );
    queryPromise.then(result => {
      let stringList = [];
      for (let i = 0; i < result.records.length; i++) {
        stringList.push(result.records[i].get(0))
      }
      callback(stringList);
      console.log("suggested relations", stringList);
    });
  }

  createNoteRelation(node, callback) {
    this.session = this.driver.session();
    let newNode = 'MERGE (a:Note {definition:$definition, title:$title, notes:$notes, created:$created})';
    let relationList = '';
    let subjectList = '';
    for (let i = 0; i < node.relations.length; i++) {
      relationList += `MERGE (a)-[r${i}:${node.relations[i].relation}]->(s${i}) `;
      subjectList += `MERGE (s${i}:Note {title: '${node.relations[i].subject}'}) `
    }
    let create = `${newNode} ${subjectList} ${relationList} RETURN a`;
    let createPromise = this.session.run(
      create,
      node);
    createPromise.then(result => {
      this.session.close();
      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      callback({ result: true, node: node });
      this.session.close();
    });
  }
}
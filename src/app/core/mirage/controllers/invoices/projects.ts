import lisbergProject from "./data/V2/lisberg-project";
import mimoProject from "./data/V2/mimo-project";
import projects from "./data/V2/projects";
import testProject from "./data/V2/test-project";
export default {

  /* getUsers: (schema) => {
      return schema.db.users;
  },
  getUser: (schema, request) => {
      let id = request.params.id;
      return schema.users.find(id);
  },
  insertUser: (schema, request) => {
      let attrs = JSON.parse(request.requestBody);
      return schema.db.users.insert(attrs);
  } */

  getProjects: () => {
    return projects;
  },

  getLisberg: () => {
    return lisbergProject;
  },

  getMimo: () => {
    return mimoProject;
  },

  getTest: () => {
    return testProject;
  }

};

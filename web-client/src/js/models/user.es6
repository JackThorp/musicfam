import axios  from 'axios'
import _      from 'lodash'
import config from 'configuration'

class User {

  constructor(user) {
    _.extend (this, user);
  }

  static mapUser (response) {
    if (response && response.data) {
      return new User(response.data);
    }
    return {};
  }

  // Maps the response data from the api to this augmented 
  // front end domain model.
  static mapUsers (response) {
    if (response && response.data) {
      return _.map (response.data, (user) => {
        return new User (user);
      });
    }
    return [];
  }


  static find(id) {
      return axios.get(config.api + '/users/' + id)
        .then(User.mapUser);
  }


  // Retreive all playlists from the API and map to damain model.
  static findAll() {
    return axios.get(config.api + '/users')
      .then(User.mapUsers);
  }

}

export default User;

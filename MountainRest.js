export default class MountainRest {
  static FLAG_PENDING = 0;
  static FLAG_DONE = 1;
  static FLAG_ERROR = 2;
  static FLAG_DENY = 3;


  launch(context, key, api, mapper = null, params = {}, code = 200, key_status = key + "_status") {

    return new Promise(function(resolve, reject) {


      context.setState({
        [key_status]: MountainRest.FLAG_PENDING
      });
      api(params).then((data) => {
        if (!data.ok) {
          context.setState({
            [key_status]: MountainRest.FLAG_ERROR
          });
          reject(data);
        }
        console.log(data);
        if (mapper != null) {
          context.setState({
            [key]: mapper(data)
          });
        } else {
          context.setState({
            [key]: data
          });
        }

        if (data.status === code) {
          context.setState({
            [key_status]: MountainRest.FLAG_DONE
          });
          if (mapper != null) {
            resolve(mapper(data));

          } else {
            resolve(data);
          }
        } else if (data.status === 401) {
          context.setState({
            [key_status]: MountainRest.FLAG_DENY
          });
        }
      }, (error) => {
        context.setState({
          [key]: MountainRest.FLAG_ERROR
        });
        reject(error);
      });
    });
  }
}

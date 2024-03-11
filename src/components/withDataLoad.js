import React from 'react';
import md5 from "md5";

const password = 'Valantis';
const stamp = new Date().toISOString().slice(0,10).replace(/-/g,"");
const hash = md5(`${password}_${stamp }`);


// const password = 'Valantis'; 
// const timestamp = new Date().toISOString().slice(0, 10).split('-').join(''); 
// const data = ${password}_${timestamp};
// 
// const authorizationString = CryptoJS.MD5(data).toString();;

let withDataLoad = (fetchConfig,propName) => Component => {

    class ComponentWithDataLoad extends React.Component {

        componentDidMount() {
          this.loadData();
        }
      
        state = {
          dataReady: false, // готовы ли данные
        };
      
        fetchError = errorMessage => {
          console.error(errorMessage);
        };
      
        fetchSuccess = loadedData => {
          this.setState({
            dataReady:true,
            loadedData:loadedData,
          });
        };
      
        loadData = async () => {
            console.log(1)
      
          try {
            let response = await fetch("http://api.valantis.store:40000/", 
            { method: 'POST', 
            headers: { 'Content-Type': 'application/json', "X-Auth": md5(`Valantis_${new Date().toISOString().slice(0, 10).split('-').join('')}`) }, 
            body: JSON.stringify( {action: "get_ids"} )
          })
            if (!response.ok) {
              throw new Error("fetch error " + response.status);
            }
            let data = await response.json();
            console.log(data)
            this.fetchSuccess(data.result);
          } 
          catch ( error )  {
            this.fetchError(error.message);
          }
      
        };
      
        render() {
      
          if ( !this.state.dataReady )
            return <div>загрузка данных...</div>;
          
          let compProps={
            ...this.props,
            [propName]:this.state.loadedData
          };
          /*
          это то же самое что и:
          let compProps={...this.props};
          compProps[propName]=this.state.loadedData;
          */
          return <Component {...compProps} /> ;
        }
      
      }

      return ComponentWithDataLoad;

}

export { withDataLoad };
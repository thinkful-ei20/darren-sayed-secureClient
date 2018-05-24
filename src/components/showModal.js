import React from 'react';
import {connect} from 'react-redux';



export class ShowModal extends React.Component{

  render(){

      if (this.props.showModal){
        return (
          <div>
            <div>Are you still there?</div> 
            <button onClick={() => this.props.restartModal()}>Stay logged in</button>
          </div>
        )
      } else {
            return null;

      }
  }

}

const mapStateToProps = state => {
  return {
      showModal : state.auth.showModal
  };
};

export default connect(mapStateToProps)(ShowModal);

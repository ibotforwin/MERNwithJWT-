import React from 'react';

//We will be dynamically assigning styles depending on message type: Error or non-error
const getStyle = (props) => {
  //Setting this class, it is the start. We will be appending bootstrap classes as we go.
  let baseClass = 'alert ';
  if (props.message.msgError) {
    console.log('MESSAGE1');
    baseClass = baseClass + 'alert-danger';
  } else {
    console.log('MESSAGE2');
    baseClass = baseClass + 'alert-primary';
  }
  return baseClass + ' text-center';
};

const Message = (props) => {
  return (
    <div className={getStyle(props)} role='alert'>
      {props.message.msgBody}
    </div>
  );
};

export default Message;

import io from 'socket.io-client';

var socket = null;

export function sectorsMiddleware (store) {
  return (next) => (action) => {
    let result = next(action);

    if (socket && action.type.match(/^((?=sectors))((?!Local).)*$/)) {
      let actionParams = action;

      if (action.type === 'sectors.addSector') {
        action.id = (Math.random() * (9999 - 10) + 10)
      }
      
      socket.emit('client-emit', actionParams);
    }

    return result;
  };
}

export default function (store) {
  socket = io('http://localhost:3000');
  socket.emit('join', {room: 'abc'});

  socket.on('server-emit', actionParams => {
    let type, params;
    let test = { type, ...params } = actionParams;
    test.type = `${type}Local`
    store.dispatch(test);
  });
}

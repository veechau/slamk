const React = require('react');
const ReactRouter = require('react-router');
const hashHistory = ReactRouter.hashHistory;

const RoomStore = require('../stores/room_store');
const RoomActions = require('../actions/room_actions');
const RoomIndexItem = require('./room_index_item');

const RoomsIndex = React.createClass({
  getInitialState() {
    return { rooms: RoomStore.all() };
  },
  componentDidMount() {
    this.roomsListener = RoomStore.addListener(this.handleChange);
    RoomActions.fetchJoinedRooms();
  },
  handleChange() {
    this.setState({ rooms: RoomStore.all() });
  },
  componentWillUnmount() {
    this.roomsListener.remove();
  },

  render() {
    const rooms = this.state.rooms;
    const channels = rooms.filter(room => room.channel);
    const dMs = rooms.filter(room => !room.channel);
    const self = this;
    return (
      <div>
        <div>CHANNELS</div>
        {channels.map(channel => {
          return <RoomIndexItem key={channel.id} room={channel} />;
        })}
        <div>DIRECT MESSAGES</div>
        {dMs.map(dM => {
          return <RoomIndexItem key={dM.id} room={dM} />;
        })}
      </div>
    );
  }
});

module.exports = RoomsIndex;

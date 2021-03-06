import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

const MessageActions = require('../actions/message_actions');
const MessageStore = require('../stores/message_store');
const SessionStore = require('../stores/session_store');

import 'brace/mode/javascript';
import 'brace/theme/github';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

const NewSnippetForm = React.createClass({
	getInitialState() {
		return {fileName: "", body: ""};
	},
	componentDidMount() {
		this.modalListener = MessageStore.addListener(this.closeModalOnSuccess);
	},
	componentWillUnmount() {
		this.modalListener.remove();
	},
	closeModalOnSuccess() {
		if (SessionStore.currentUser().id === MessageStore.lastMessageUserId()) {
			this.props.closeModal();
		}
	},

	onCodeChange(newCode) {
		this.setState({body: newCode});
	},
	update(property) {
		return (e) => this.setState({[property]: e.target.value});
	},

	handleSubmit(e) {
		e.preventDefault();
		const self = this;

		$.ajax({
			url: 'https://api.github.com/gists',
			method: 'POST',
			data: JSON.stringify({
				"public": true,
				"files": {
					[this.state.fileName]: {
					"content": `${this.state.body}`
					}
				}
			}),
			success(res) { MessageActions.createMessage({
				body: res.html_url,
				room_id: self.props.roomId
			}); }
		});
	},

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<FormGroup controlId="formControlsText">
					<ControlLabel>Text</ControlLabel>
					<FormControl type="text" placeholder="Enter the filename with an extension here" value={this.state.fileName} onChange={this.update("fileName")} />
				</FormGroup>
				<AceEditor
					mode="javascript"
					theme="github"
					value={this.state.body}
					onChange={this.onCodeChange}
					name="UNIQUE_ID_OF_DIV"
					editorProps={{$blockScrolling: true}}
				/>
				<Button type="submit">
					Send
				</Button>
			</form>
		);
	}
});

module.exports = NewSnippetForm;

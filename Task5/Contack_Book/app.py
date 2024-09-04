from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# In-memory contact list (for demonstration)
contacts = []

@app.route('/')
def home():
    return "Welcome to the Contact Book API!"

# Add a new contact
@app.route('/contacts', methods=['POST'])
def add_contact():
    new_contact = request.json
    new_contact['id'] = len(contacts) + 1
    contacts.append(new_contact)
    return jsonify(new_contact), 201

# View all contacts
@app.route('/contacts', methods=['GET'])
def get_contacts():
    return jsonify(contacts)

# Search contacts by name or phone number
@app.route('/contacts/search', methods=['GET'])
def search_contact():
    search_term = request.args.get('q', '').lower()
    results = [contact for contact in contacts if search_term in contact['name'].lower() or search_term in contact['phone']]
    return jsonify(results)

# Update contact by ID
@app.route('/contacts/<int:id>', methods=['PUT'])
def update_contact(id):
    contact = next((c for c in contacts if c['id'] == id), None)
    if contact is None:
        return jsonify({'error': 'Contact not found'}), 404

    data = request.json
    contact.update(data)
    print(f"Updated contact: {contact}")  # Log updated contact
    return jsonify(contact)

# Delete contact by ID
@app.route('/contacts/<int:id>', methods=['DELETE'])
def delete_contact(id):
    global contacts
    contacts = [c for c in contacts if c['id'] != id]
    return jsonify({'message': 'Contact deleted'})

if __name__ == '__main__':
    app.run(debug=True)

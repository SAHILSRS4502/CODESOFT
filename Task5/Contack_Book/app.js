const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');
const searchInput = document.getElementById('search');
let editingId = null;  // To track the ID of the contact being edited

// Load contacts when the page loads
document.addEventListener('DOMContentLoaded', loadContacts);

// Handle form submission
contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    const contact = { name, phone, email, address };

    try {
        if (editingId) {
            // Update existing contact
            const response = await fetch(`http://127.0.0.1:5000/contacts/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contact),
            });

            if (!response.ok) {
                throw new Error('Failed to update contact');
            }
        } else {
            // Add new contact
            const response = await fetch('http://127.0.0.1:5000/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contact),
            });

            if (!response.ok) {
                throw new Error('Failed to add contact');
            }
        }

        // Reload contacts
        loadContacts();

        // Clear the form
        contactForm.reset();
        editingId = null;  // Reset editing ID
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle search input
searchInput.addEventListener('input', loadContacts);

async function loadContacts() {
    let url = 'http://127.0.0.1:5000/contacts';
    const query = searchInput.value.trim();
    if (query) {
        url += `/search?q=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(url);
        const contacts = await response.json();

        // Clear existing contacts
        contactList.innerHTML = '';

        // Display contacts
        contacts.forEach(contact => {
            const contactElement = document.createElement('div');
            contactElement.classList.add('contact');
            contactElement.innerHTML = `
                <strong>${contact.name}</strong> (${contact.phone})
                <br>Email: ${contact.email}
                <br>Address: ${contact.address}
                <button onclick="deleteContact(${contact.id})">Delete</button>
                <button onclick="editContact(${contact.id})">Edit</button>
            `;
            contactList.appendChild(contactElement);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteContact(id) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/contacts/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }

        // Reload contacts
        loadContacts();
    } catch (error) {
        console.error('Error:', error);
    }
}

function editContact(id) {
    fetch(`http://127.0.0.1:5000/contacts/${id}`)
        .then(response => response.json())
        .then(contact => {
            document.getElementById('name').value = contact.name;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('email').value = contact.email;
            document.getElementById('address').value = contact.address;
            editingId = contact.id;  // Set the ID of the contact being edited
        })
        .catch(error => console.error('Error:', error));
}

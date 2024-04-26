// src/MyApp.jsx
import React, {useState, useEffect} from 'react';

import Table from "./Table";
import Form from "./Form";

const characters = [
    {
      name: "Charlie",
      job: "Janitor"
    },
    {
      name: "Mac",
      job: "Bouncer"
    },
    {
      name: "Dee",
      job: "Aspring actress"
    },
    {
      name: "Dennis",
      job: "Bartender"
    }
  ];
  
function MyApp() {
    const [characters, setCharacters] = useState([]);
    
      function removeOneCharacter(index) {
        deleteUser(characters[index]._id)
        .then((res) => {
          if (res.status === 204) {
            const updated = characters.filter((character, i) => i !== index);
            setCharacters(updated);
          }
          else if (res.status === 404){ 
            console.log("User not found.");
          }
          else {
            console.log(res.status);
            console.log("Failed to delete user.");
          }
        }).catch((error) => { console.log("Error:", error);
      })
      }

      function updateList(person) { 
        postUser(person)
          .then((res) =>
          {

            if (res.status === 201) return res.json();
          }).then((json) => {
            console.log("Hi");
            console.log(json);
            if (json) setCharacters([...characters, json]);
    }).catch((error) => {
    console.log(error);
    })
  }



      function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }
    function postUser(person) {
      const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });
  
      return promise;
    }

function deleteUser(id) {
    const promise = fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE",
    });
    return promise;
}
    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => { console.log(error); });
    }, [] );
      return (
        <div className="container">
          <Table
            characterData={characters}
            removeCharacter={removeOneCharacter}
          />
      
          <Form handleSubmit={updateList}/> 
        </div>
      );
}

export default MyApp;
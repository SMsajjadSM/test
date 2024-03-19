import { Children, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [AddFriend, SetAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleAddFriend() {
    SetAddFriend((AddFriend) => !AddFriend);
  }
  function handleAddFriends(friend) {
    SetAddFriend(false);
    setFriends((friends) => [...friends, friend]);
  }
  function handleSelectFriend(friends) {
    setSelectedFriend((cur) => (cur?.id === friends.id ? null : friends));
    SetAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null)
  }
  return (
    <div className="app">
      <div className="sidebar">
        <Friendlist
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriends={handleSelectFriend}
        />
        {AddFriend && <FormAddFriend onAddFriend={handleAddFriends} />}
        <Button onClick={handleAddFriend}>
          {AddFriend ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function Friendlist({ friends, onSelectFriends, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectFriend={onSelectFriends}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectFriend, selectedFriend }) {
  const FrinedId = selectedFriend?.id === friend.id;
  // console.log(FrinedId);
  return (
    <li className={FrinedId ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3> {friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}{" "}
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}{" "}
      {friend.balance === 0 && <p> you and {friend.name} are even</p>}
      <Button onClick={() => selectFriend(friend)}>
        {" "}
        {FrinedId ? "Close" : "Select"}{" "}
      </Button>
    </li>
  );
}
function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id: id,
    };
    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
    onAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <label>📷Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => {
          setImage(e.target.value);
        }}
      />
      <Button> Add </Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPayByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paid = bill ? bill - paidByUser : "";
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? paid : -paid);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Splite a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👦 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPayByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👭 {selectedFriend.name} expens</label>
      <input type="text" disabled value={paid} />

      <label>🤑 Who is payin Bills</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button> Split bill </Button>
    </form>
  );
}

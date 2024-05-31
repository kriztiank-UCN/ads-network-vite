import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { db, auth } from "../firebaseConfig"
import { useLocation, Link } from "react-router-dom"
import MessageForm from "../components/MessageForm"
import User from "../components/User"

const Chat = () => {
  const [chat, setChat] = useState()
  const [text, setText] = useState("")
  const [users, setUsers] = useState([])

  const location = useLocation()

  const user1 = auth.currentUser.uid

  const getChat = async ad => {
    const buyer = await getDoc(doc(db, "users", user1))
    const seller = await getDoc(doc(db, "users", ad.postedBy))
    setChat({ ad, me: buyer.data(), other: seller.data() })
  }

  const getList = async () => {
    const msgRef = collection(db, "messages")
    const q = query(msgRef, where("users", "array-contains", user1))

    const msgsSnap = await getDocs(q)
    const messages = msgsSnap.docs.map(doc => doc.data())

    const users = []
    for (const message of messages) {
      const adRef = doc(db, "ads", message.ad)
      const meRef = doc(
        db,
        "users",
        message.users.find(id => id === user1)
      )
      const otherRef = doc(
        db,
        "users",
        message.users.find(id => id !== user1)
      )

      const adDoc = await getDoc(adRef)
      const meDoc = await getDoc(meRef)
      const otherDoc = await getDoc(otherRef)

      users.push({
        ad: adDoc.data(),
        me: meDoc.data(),
        other: otherDoc.data(),
      })
    }
    setUsers(users)
  }

  useEffect(() => {
    if (location.state?.ad) {
      getChat(location.state?.ad)
    }
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // console.log(users);

  const handleSubmit = async e => {
    e.preventDefault()

    const user2 = chat.other.uid
    const chatId =
      user1 > user2 ? `${user1}.${user2}.${chat.ad.adId}` : `${user2}.${user1}.${chat.ad.adId}`

    await addDoc(collection(db, "messages", chatId, "chat"), {
      text,
      sender: user1,
      createdAt: Timestamp.fromDate(new Date()),
    })
    setText("")
  }

  return (
    <div className="row g-0">
      <div className="col-2 col-md-4 users_container" style={{ borderRight: "1px solid #ddd" }}>
        {users.map((user, i) => (
          <User key={i} user={user} />
        ))}
      </div>
      <div className="col-10 col-md-8 position-relative">
        {chat ? (
          <>
            <div className="text-center mt-1" style={{ borderBottom: "1px solid #ddd" }}>
              <h3>{chat.other.name}</h3>
            </div>
            <div className="p-2" style={{ borderBottom: "1px solid #ddd" }}>
              <div className="d-flex align-items-center">
                <img
                  src={chat.ad.images[0].url}
                  alt={chat.ad.title}
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="d-flex align-items-center justify-content-between flex-grow-1 ms-1">
                  <div>
                    <h6>{chat.ad.title}</h6>
                    <small>{chat.ad.price}</small>
                  </div>
                  <Link
                    className="btn btn-secondary btn-sm"
                    to={`/${chat.ad.category.toLowerCase()}/${chat.ad.adId}`}
                  >
                    View Ad
                  </Link>
                </div>
              </div>
            </div>
            <MessageForm text={text} setText={setText} handleSubmit={handleSubmit} />
          </>
        ) : (
          <div className="text-center mt-5">
            <h3>Select a user to start conversation</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat

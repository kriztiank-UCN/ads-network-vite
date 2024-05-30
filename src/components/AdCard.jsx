/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { db, auth } from "../firebaseConfig"

// recieve ad as a prop from parent component and destructure it
const AdCard = ({ ad }) => {
  const [users, setUsers] = useState([])
  // create a dynamic link for each ad
  const adLink = `/${ad.category.toLowerCase()}/${ad.id}`

  useEffect(() => {
    const docRef = doc(db, "favorites", ad.id)
    const unsub = onSnapshot(docRef, querySnapshot => setUsers(querySnapshot.data().users))
    return () => unsub()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleFavorite = async () => {
    // first we are checking whether this user has logged in or not
    // if there is a user true else false
    let isFav = users.includes(auth.currentUser.uid)

    await updateDoc(doc(db, "favorites", ad.id), {
      // if the user has marked the ad as favourite then the user will be in the users array
      users: isFav
        ? // when clicking the favorite button, we will filter out the user from favorite list with array.filter method
          users.filter(id => id !== auth.currentUser.uid)
        : // otherwise, we will add the user in favorite list
          users.concat(auth.currentUser.uid),
    })
  }

  // console.log(users)

  return (
    <div className="card">
      <Link to={adLink}>
        <img
          src={ad.images[0].url}
          alt={ad.title}
          className="card-img-top"
          style={{ width: "100%", height: "200px" }}
        />
      </Link>
      <div className="card-body">
        <p className="d-flex justify-content-between align-items-center">
          <small>{ad.category}</small>
          {users?.includes(auth.currentUser?.uid) ? (
            // if the user has marked the ad as favorite, we will show a filled heart icon
            <AiFillHeart size={30} onClick={toggleFavorite} className="text-danger" />
          ) : (
            // otherwise, we will show an outlined heart icon
            <AiOutlineHeart size={30} onClick={toggleFavorite} className="text-danger" />
          )}
        </p>
        <Link to={adLink}>
          <h5 className="card-title">{ad.title}</h5>
        </Link>
        <Link to={adLink}>
          <p className="card-text">
            {ad.location} - {ad.publishedAt.toDate().toDateString()}
            <br />
            Price. {Number(ad.price).toLocaleString()}
          </p>
        </Link>
      </div>
    </div>
  )
}

export default AdCard

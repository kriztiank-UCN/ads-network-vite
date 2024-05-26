import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebaseConfig"
import { FaUserAlt, FaCloudUploadAlt } from "react-icons/fa"
import moment from "moment"

// The profile page we will send request to Firestore and get data from the users collection of particular document which is the ID current user. We will use useParams to get the ID from the URL.

// format createdAt to month and year with moment.js
const monthAndYear = date =>
  `${moment(date).format("MMMM").slice(0, 3)} ${moment(date).format("YYYY")}`

const Profile = () => {
  // Get the ID from the URL
  const { id } = useParams()
  // create state variables and set default values
  const [user, setUser] = useState()

  const getUser = async () => {
    // when we use getDoc, we need to check whether document exists or not using exists() method
    const docSnap = await getDoc(doc(db, "users", id))
    if (docSnap.exists()) {
      // if document exists, set the user state with the data from the document
      setUser(docSnap.data())
    }
  }
  useEffect(() => {
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // console.log(user)

  // if uder exists, display user info else return null
  return user ? (
    <div className="mt-5 container row">
      <div className="text-center col-sm-2 col-md-3">
        <FaUserAlt size={50} />
        <div className="dropdown my-3 text-center">
          <button
            className="btn btn-secondary btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Edit
          </button>
          <ul className="dropdown-menu">
            <li>
              <label htmlFor="photo" className="dropdown-item">
                <FaCloudUploadAlt size={30} /> Upload Photo
              </label>
              <input type="file" id="photo" accept="image/*" style={{ display: "none" }} />
            </li>
            <li className="dropdown-item btn">Remove Photo</li>
          </ul>
        </div>
        <p>Member since {monthAndYear(user.createdAt.toDate())}</p>
      </div>
      <div className="col-sm-10 col-md-9">
        <h3>{user.name}</h3>
        <hr />
      </div>
    </div>
  ) : null
}

export default Profile

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { deleteDoc, doc, getDoc } from "firebase/firestore"
import { auth, db, storage } from "../firebaseConfig"
import { ref, deleteObject } from "firebase/storage"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { FaTrashAlt } from "react-icons/fa"
import useSnapshot from "../utils/useSnapshot"
import { toggleFavorite } from "../utils/fav"

const Ad = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ad, setAd] = useState()
  const [idx, setIdx] = useState(0)

  const { val } = useSnapshot("favorites", id)

  const getAd = async () => {
    const docRef = doc(db, "ads", id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setAd(docSnap.data())
    }
  }

  useEffect(() => {
    getAd()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // console.log(ad)

  const deleteAd = async () => {
    const confirm = window.confirm(`Delete ${ad.title}?`)
    if (confirm) {
      // delete images
      for (const image of ad.images) {
        const imgRef = ref(storage, image.path)
        await deleteObject(imgRef)
      }
      // delete fav doc from firestore
      await deleteDoc(doc(db, "favorites", id))
      // delete ad doc from firestore
      await deleteDoc(doc(db, "ads", id))
      // navigate to seller profile
      navigate(`/profile/${auth.currentUser.uid}`)
    }
  }

  return ad ? (
    <div className="mt-5 container">
      <div className="row">
        <div id="carouselExample" className="carousel slide col-md-8">
          <div className="carousel-inner">
            {ad.images.map((image, i) => (
              <div className={`carousel-item ${idx === i ? "active" : ""}`} key={i}>
                <img src={image.url} className="d-block w-100" alt={ad.title} />

                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="prev"
                  onClick={() => setIdx(i)}
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="next"
                  onClick={() => setIdx(i)}
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title">DKR. {Number(ad.price).toLocaleString()}</h5>
                {val?.users?.includes(auth.currentUser?.uid) ? (
                  <AiFillHeart
                    size={30}
                    onClick={() => toggleFavorite(val.users, id)}
                    className="text-danger"
                  />
                ) : (
                  <AiOutlineHeart
                    size={30}
                    onClick={() => toggleFavorite(val.users, id)}
                    className="text-danger"
                  />
                )}
              </div>
              <h6 className="card-subtitle mb-2">{ad.title}</h6>
              <div className="d-flex justify-content-between">
                <p className="card-text">
                  {ad.location} -{' '} <small>{ad.publishedAt.toDate().toDateString()}</small>
                </p>
                <FaTrashAlt size={20} className="text-danger" onClick={deleteAd} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h3>Description</h3>
        <p>{ad.description}</p>
      </div>
    </div>
  ) : null
}

export default Ad

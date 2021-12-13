import React, { useEffect, useState } from 'react';
import ReactPlayer from "react-player";
import { osServices } from '../../../controllers/_services/ordersystem.service';

const OsProductMediaGallery = (props) => {
  const product = props.data
  const videoFilePath = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
  const [gallery, setGallery] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [showPreviews, setShowPreviews] = useState({})
  const [firstPreview, setFirstPreview] = useState(true)

  useEffect(() => {
    setLoading(true)
    osServices.osLoadProductGallery({sku: product.sku}).then(response => {
      setGallery(response.data)

      let updatePreviews = {}
      response.data.map(item => {
        updatePreviews['preview'+item.media_id] = false
      })
      setShowPreviews(updatePreviews)

      setLoading(true)
    })

    //

  }, [])

  useEffect(() => {
    const videoElement = document.querySelector('[data-type="video"]')
    if (videoElement != null) {
      // videoElement.click()
    }
  });

  const handleShowPreview = (e) => {
    const mediaId = e.currentTarget.getAttribute('data-target')
    console.log('mediaId')
    console.log(mediaId)

    let updatePreviews = {...showPreviews}

    Object.keys(updatePreviews).map((key, index) => {
      updatePreviews[key] = false
    })

    updatePreviews['preview'+mediaId] = true
    setShowPreviews(updatePreviews)
    setFirstPreview(false)
  }


  return (
    <div>
      <div class="os-product-gallery-preview">
        {firstPreview && <img src={product.thumbnail} width="100%" />}

        {gallery && gallery.map(item => {
          if (!showPreviews['preview'+item.media_id]) return
          if (item.media_type == 'video') {
            return <div class="os-product-gallery-preview__item"><ReactPlayer url={item.media_path} width="100%" height="100%" controls={true} /></div>
          } else {
            return <div class="os-product-gallery-preview__item"><img src={item.media_path} width="100%" /></div>
          }
        })}
      </div>

      <div class="os-product-gallery-thumbnail mt-4">
        {gallery && gallery.map(item => {
          return <div class="os-product-gallery-thumbnail__item" data-type={item.media_type} data-target={item.media_id} onClick={handleShowPreview}><img src={item.media_thumbnail} width="100" height="100" /></div>
        })}
      </div>
    </div>
  );
};

export default OsProductMediaGallery;
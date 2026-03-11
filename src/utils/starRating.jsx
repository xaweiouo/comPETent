import fullStar from '../images/icons/star_full_icon.png';
import halfStar from '../images/icons/star_half_icon.png';
import nullStar from '../images/icons/star_null_icon.png';

export const starRating = (rating,height) => {

  const roundedRating = Math.round(rating * 2) / 2;

  const stars = [1, 2, 3, 4, 5].map(star => {
    switch (true) {

      case (roundedRating >= star):
        return fullStar;

      case (roundedRating === star - 0.5):
        return halfStar;

      default:
        return nullStar;
    }
  });

    return stars.map((star, index) => (
    <img key={index} src={star} alt="" className='me-1' style={{height:height}}/>
  ));
};
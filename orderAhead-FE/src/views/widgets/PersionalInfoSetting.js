import React, { lazy, useState, useEffect } from 'react'
import {
  CCard,
  CButton,
  CCardBody
} from '@coreui/react'
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';
// import {
//     MuiPickersUtilsProvider,
//     KeyboardTimePicker,
//     KeyboardDatePicker,
//   } from '@material-ui/pickers';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userService } from '../../controllers/_services';
import { successNotification, warningNotification } from '../../controllers/_helpers';

const useStylesReddit = makeStyles((theme) => ({
    root: {
      border: 'none',
      overflow: 'hidden',
      backgroundColor: '#fcfcfb',
      fontWeight: '700',
      lineHeight: '24px',
      fontSize: '24px',
      color: "green",
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:hover': {
        backgroundColor: '#fff',
      },
      '&$focused': {
        backgroundColor: '#fff',
        boxShadow: `${alpha("#24242f", 0.25)} 0 0 0 1px`,
        borderRadius: 4,
        borderColor: "#24242f",
        borderBottom: "2px solid black",
        color: "green"
      }
    },
    focused: {},
  }));

function RedditTextField(props) {
    const classes = useStylesReddit();

    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
  }

const PersionalInfoSetting = () => {
 const dispatch = useDispatch()

 const [isSubmitting, setIsSubmitting] = useState(false)
 const [firstName, setFirstName] = useState()
 const [lastName, setLastName] = useState()
 const [medId, setMedId] = useState('')
 const [address1, setAddress1] = useState('')
 const [address2, setAddress2] = useState('')
 const [city, setCity] = useState('')
 const [zip, setZip] = useState('')
 const [phoneNumber, setPhoneNumber] = useState()
 const [lastPurchaseDate, setLastPurchaseDate] = useState('')

 const user = useSelector(state => state.user)


//  # Med ID, Address 1, Address 2, City, Zip, Phone Number, Last Purchase Date
 const fields = [
    {id: 'first-name', jsonName: 'first_name', label: 'First Name', value: firstName, updateValueFunc: setFirstName},
    {id: 'last-name', jsonName: 'last_name', label: 'Last Name', value: lastName, updateValueFunc: setLastName},
    {id: 'medical-id', jsonName: 'med_id', label: 'Med ID', value: medId, updateValueFunc: setMedId},
    {id: 'address-1', jsonName: 'address_1', label: 'Address 1', value: address1, updateValueFunc: setAddress1},
    {id: 'address-2', jsonName: 'address_2', label: 'Address 2', value: address2, updateValueFunc: setAddress2},
    {id: 'city', jsonName: 'city', label: 'City', value: city, updateValueFunc: setCity},
    {id: 'zip', jsonName: 'zip', label: 'Zip', value: zip, updateValueFunc: setZip},
    {id: 'phone-number', jsonName: 'phone_number', label: 'Phone Number', value: phoneNumber, updateValueFunc: setPhoneNumber},
    {type: 'date', id: 'last-purchase-date', jsonName: 'last_purchase_date', label: 'Last Purchase Date', value: lastPurchaseDate, updateValueFunc: setLastPurchaseDate},
]

 useEffect(() => {
    if (localStorage.getItem('userId') && user) {
        console.log('user');
        console.log(user);
        fields.forEach(field => {
            field.updateValueFunc(user[field.jsonName])
        })
    }
 }, [user]);

  const onSubmit = () => {
      if (user) {
        let updateFields ={}
        fields.forEach(field => {
            updateFields[field.jsonName] = field.value
        })


        const newUser = {
            ...user,
            ...updateFields
        }
        setIsSubmitting(true);
        userService.update(newUser).then(
            result => {
                console.log(result)
                dispatch({type: 'set', user: newUser})
                successNotification("Updated your profile successfully", 3000)
                setIsSubmitting(false)
            },
            error => {
                warningNotification(error, 3000)
                setIsSubmitting(false)
            }
        )
      }
  }


  // render
  return (

    <CCard color="transparent" className="d-box-shadow1 d-border">
        <CCardBody className="card-setting m-0">

            {fields.map((field) => {
                if (field.type == 'date')
                    return <div className="d-flex mt-3">
                        <RedditTextField
                            id={field.id}
                            label={field.label}
                            placeholder={field.label}
                            value={field.value}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            variant="filled"
                            onChange={(e) => field.updateValueFunc(e.target.value)}
                        />
                    </div>
                else
                    return <div className="d-flex mt-3">
                        <RedditTextField
                            id={field.id}
                            label={field.label}
                            placeholder={field.label}
                            value={field.value}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            variant="filled"
                            onChange={(e) => field.updateValueFunc(e.target.value)}
                        />
                    </div>
            })}

            <div className="d-flex mt-0 float-right">
                <CButton className="button-exchange" onClick={() => onSubmit()} disabled={isSubmitting}>
                    {isSubmitting ? 'Wait...' : 'Update'}
                </CButton>
            </div>
        </CCardBody>
    </CCard>

    )
}

export default PersionalInfoSetting

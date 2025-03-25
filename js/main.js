const MAX_NAME_LENGTH = 120;
const MAX_MSG_LENGTH = 1000;

$(document).ready(()=>{
	loadEmailJS();
	const serviceID = 'service_rdshuvk';
	const templateID = 'template_aafdzz8';

	const $getStartedForm = $('#gt_form');
	$($getStartedForm).on('submit', async function (event) {
		event.preventDefault();
		const formData = {
			full_name: this.elements.full_name.value,
			user_email: this.elements.user_email.value,
			user_phn: this.elements.user_phn.value,
			user_area: this.elements.user_area.value,
			user_date: this.elements.user_date.value,
			user_start_time: this.elements.user_start_time.value,
			user_end_time: this.elements.user_end_time.value,
			user_message: this.elements.user_message.value,
		};

		formData['user_scheduled_req'] = `${formData.user_date}, from ${formData.user_start_time} to ${formData.user_end_time}`;
		formData['user_name'] = formData.full_name;
		const errors = _valEmailForm(formData);
		if (errors.hasErrors){
			showMsg(errors.error_html);
			return;
		}

		const res = await emailjs.send(serviceID, templateID, formData);
		if (res.status === 200){
			showMsg(
				'Your message has been successfully sent, and we’ll get back to you as soon as possible.', 
				'success',
				'Sent'
			);
		}

	});
});


function loadEmailJS(){
	emailjs.init({
		publicKey: "MmWhIEP4VcDD1Bfxi",
	});
}

function _valEmailForm(data){
	// Name: just normal human name characters
	const errors = [];
	if (!_vn(data.full_name)){
		errors.push(`Full name is not valid, must contain only letters, spaces and period and less than ${MAX_NAME_LENGTH} characters long.`);
	}
	if (!validator.isEmail(data.user_email)){
		errors.push('Email is not valid');
	}
	if (!validator.isMobilePhone(data.user_phn)) {
		errors.push('Phone number not valid');
	}
	if (!validator.isDate(data.user_date)){
		errors.push('User date not valid');
	}
	if (!validator.isTime(data.user_start_time)){
		errors.push('User start time not valid');
	}
	if (!validator.isTime(data.user_end_time)){
		errors.push('User end time not valid');
	}
	if (!_vm(data.user_message)){
		errors.push(`Message too long must be less then ${MAX_MSG_LENGTH} characters long.`);
	}
	ep = [];
	for(error of errors){
		ep.push(`<li><strong>${error}</strong></li>`);
	}
	eh = `<ul style="font-size: 13px; color: red; text-align: left;">${ep}</ul>`;
	return {
		errors: errors,
		hasErrors: Boolean(errors.length),
		error_html: eh,
	}
}

const _vn = (name)=>(/^[A-Za-z\s\-\.]+$/).test(name) && name.length <= MAX_NAME_LENGTH;
const _vm = (msg)=> msg.length <= MAX_MSG_LENGTH;


const showMsg = (msg, icon='error', title='Opps')=>{
	Swal.fire({
	  icon: icon,
	  title: title,
	  html: msg,
	  showClass: {
	    popup: `
	      animate__animated
	      animate__fadeInUp
	      animate__faster
	    `
	  },
	  hideClass: {
	    popup: `
	      animate__animated
	      animate__fadeOutDown
	      animate__faster
	    `
	  }
	});
}

// user_email, user_name, user_phn, user_message, user_area, user_scheduled_req
import { toast, ToastContainer } from 'react-toastify'

export const PostDeleteToastr = () => {
  return (
    <ToastContainer position="bottom-center" autoClose={3000} pauseOnHover={false}>
      {toast.info('Deleted Successfully')}
    </ToastContainer>
  )
}

export const ErrorToastr = ({ error }) => {
  return (
    <ToastContainer position="bottom-center" pauseOnHover={false}>
      {toast.error(`${error || 'Something went wrong'}. Please try again later.`)}
    </ToastContainer>
  )
}

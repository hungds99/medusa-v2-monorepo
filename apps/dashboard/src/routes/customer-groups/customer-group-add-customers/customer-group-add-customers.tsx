import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { AddCustomersForm } from "./components/add-customers-form"

export const CustomerGroupAddCustomers = () => {
  const { id } = useParams()

  return (
    <RouteFocusModal>
      <AddCustomersForm customerGroupId={id!} />
    </RouteFocusModal>
  )
}

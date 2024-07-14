import { Order } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ArrowPath, CurrencyDollar, Envelope, FlyingBox } from "@medusajs/icons"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { CustomerInfo } from "../../../../../components/common/customer-info"

type OrderCustomerSectionProps = {
  order: Order
}

export const OrderCustomerSection = ({ order }: OrderCustomerSectionProps) => {
  return (
    <Container className="divide-y p-0">
      <Header />
      <CustomerInfo.ID data={order} />
      <CustomerInfo.Contact data={order} />
      <CustomerInfo.Company data={order} />
      <CustomerInfo.Addresses data={order} />
    </Container>
  )
}

const Header = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.customer")}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t("transferOwnership.label"),
                to: `transfer-ownership`,
                icon: <ArrowPath />,
              },
            ],
          },
          {
            actions: [
              {
                label: t("addresses.shippingAddress.editLabel"),
                to: "shipping-address",
                icon: <FlyingBox />,
              },
              {
                label: t("addresses.billingAddress.editLabel"),
                to: "billing-address",
                icon: <CurrencyDollar />,
              },
            ],
          },
          {
            actions: [
              {
                label: t("email.editLabel"),
                to: `email`,
                icon: <Envelope />,
              },
            ],
          },
        ]}
      />
    </div>
  )
}

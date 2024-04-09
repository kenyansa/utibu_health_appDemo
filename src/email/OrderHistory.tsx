import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Tailwind,
  } from "@react-email/components"
  import { OrderInformation } from "./components/OrderInformation"
  import React from "react"
  
  type OrderHistoryEmailProps = {
    orders: {
      id: number
      pricePaidInShillings: number
      createdAt: Date
      downloadVerificationId: string
      medication: {
        name: string
        imagePath: string
        description: string
      }
    }[]
  }
  
  OrderHistoryEmail.PreviewProps = {
    orders: [
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInShillings: 1000,
        downloadVerificationId: crypto.randomUUID(),
        medication: {
          name: "Medication name",
          description: "Some description",
          imagePath:
            "/medications/5aba7442-e4a5-4d2e-bfa7-5bd358cdad64-02 - What Is Next.js.jpg",
        },
      },
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInShillings: 2000,
        downloadVerificationId: crypto.randomUUID(),
        medication: {
          name: "Medication name 2",
          description: "Some other desc",
          imagePath:
            "/medications/db3035a5-e762-41b0-996f-d54ec730bc9c-01 - Course Introduction.jpg",
        },
      },
    ].map(order => ({
        ...order,
        id: Number(order.id) // Convert the id to a number
      })),
  } satisfies OrderHistoryEmailProps
  
  export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
    return (
      <Html>
        <Preview>Order History & Downloads</Preview>
        <Tailwind>
          <Head />
          <Body className="font-sans bg-white">
            <Container className="max-w-xl">
              <Heading>Order History</Heading>
              {orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <OrderInformation
                    order={order}
                    medication={order.medication}
                    downloadVerificationId={order.downloadVerificationId}
                  />
                  {index < orders.length - 1 && <Hr />}
                </React.Fragment>
              ))}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }
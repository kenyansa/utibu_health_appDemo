import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Tailwind,
  } from "@react-email/components"
  import { OrderInformation } from "./components/OrderInformation"
  import { randomBytes } from 'crypto';

  function generateRandomNumber(length: number): number {
    return parseInt(randomBytes(length).toString('hex'), 16);
  }

  type PurchaseReceiptEmailProps = {
    medication: {
      name: string
      imagePath: string
      description: string
    }
    order: { id: number; createdAt: Date; pricePaidInShillings: number }
    downloadVerificationId: string
  }
  
  PurchaseReceiptEmail.PreviewProps = {
    medication: {
      name: "Medication name",
      description: "Some description",
      imagePath:
        "/products/5aba7442-e4a5-4d2e-bfa7-5bd358cdad64-02 - What Is Next.js.jpg",
    },
    order: {
      id: generateRandomNumber(8),
      createdAt: new Date(),
      pricePaidInShillings: 10000,
    },
    downloadVerificationId: crypto.randomUUID(),
  } satisfies PurchaseReceiptEmailProps
  
  export default function PurchaseReceiptEmail({
    medication,
    order,
    downloadVerificationId,
  }: PurchaseReceiptEmailProps) {
    return (
      <Html>
        <Preview>Download {medication.name} and view receipt</Preview>
        <Tailwind>
          <Head />
          <Body className="font-sans bg-white">
            <Container className="max-w-xl">
              <Heading>Purchase Receipt</Heading>
              <OrderInformation
                order={order}
                medication={medication}
                downloadVerificationId={downloadVerificationId}
              />
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }
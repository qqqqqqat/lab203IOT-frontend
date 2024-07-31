import Layout from "../components/layout";
import useSWR from "swr";
import { Order } from "../lib/models";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { Alert, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

export default function Alloforder() {
  // Fetch orders
  const { data: orders, error: ordersError, mutate } = useSWR<Order[]>("/order");
  const navigate = useNavigate();
  
  // Handle loading state
  if (!orders) {
    return <Loading />;
  }

  // Handle errors
  if (ordersError) {
    return (
      <Alert
        color="red"
        title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
        icon={<IconAlertTriangleFilled />}
      >
        {ordersError?.message}
      </Alert>
    );
  }

  // Ensure orders is an array
  if (!Array.isArray(orders)) {
    return (
      <Alert
        color="red"
        title="ข้อมูลไม่ถูกต้อง"
        icon={<IconAlertTriangleFilled />}
      >
        ข้อมูลที่ได้รับไม่ถูกต้อง
      </Alert>
    );
  }

  const handleDelete = async (orderId: string) => {
    try {
     
      await axios.delete(`/order/${orderId}`);
      notifications.show({
        title: "ลบคำสั่งซื้อสำเร็จ",
        message: "ลบคำสั่งซื้อเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "green",
      });
      await mutate(); // Revalidate the data
      navigate("/orders");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        if (status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลคำสั่งซื้อ",
            message: "ไม่พบข้อมูลคำสั่งซื้อที่ต้องการลบ",
            color: "red",
          });
        } else if (status >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    }
  };

  return (
    <Layout>
      <section className="container mx-auto py-8">
        <div className="flex justify-between mb-4">
          <h1>รายการคำสั่งซื้อเครื่องดื่ม</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {orders.map(order => (
            <div className="border border-solid border-neutral-200 p-4" key={order.id.toString()}>
              <h2 className="text-lg font-semibold">Order ID: {order.id}</h2>
              <p>ชื่อเครื่องดื่ม: {order.getmenuname || "ข้อมูลไม่พบ"}</p>
              <p>จำนวน: {order.amount}</p>
              <p>รายละเอียด: {order.detail}</p>
              <p>ราคารวม: {order.total}</p>
              <Button
                color="red"
                leftSection={<IconTrash />}
                size="xs"
                onClick={() => {
                  modals.openConfirmModal({
                    title: "คุณต้องการลบคำสั่งซื้อนี้ใช่หรือไม่",
                    children: (
                      <span className="text-xs">
                        เมื่อคุณดำเนินการลบคำสั่งซื้อนี้แล้ว จะไม่สามารถย้อนกลับได้
                      </span>
                    ),
                    labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                    onConfirm: () => handleDelete(order.id.toString()), // Pass the order ID
                    confirmProps: {
                      color: "red",
                    },
                  });
                }}
              >
                ลบคำสั่งซื้อ
              </Button>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
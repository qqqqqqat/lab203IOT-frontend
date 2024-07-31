import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Order } from "../lib/models";

export default function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { menu } = location.state as { menu: { menuname: string, price: number } };

  const [isProcessing, setIsProcessing] = useState(false);

  const orderCreateForm = useForm({
    initialValues: {
      amount: 1,
      total: menu.price,
      detail: "",
      getmenuname: menu.menuname, // Include the menuname in the initial values
    },

    validate: {
      amount: isNotEmpty("กรุณาระบุจำนวน"),
    },
  });

  // Update total price whenever amount changes
  useEffect(() => {
    const total = menu.price * orderCreateForm.values.amount;
    orderCreateForm.setFieldValue("total", total);
  }, [orderCreateForm.values.amount, menu.price]);

  const handleSubmit = async (values: typeof orderCreateForm.values) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<Order>(`/order`, {
        ...values,
        total: values.total, // Ensure total is included in the payload
      });
      notifications.show({
        title: "เพิ่มข้อมูลรายการเครื่องดื่มสำเร็จ",
        message: "รายการข้อมูลเครื่องดื่มได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/orders`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">สั่งเมนูเครื่องดื่ม</h1>

          <form onSubmit={orderCreateForm.onSubmit(handleSubmit)} className="space-y-8">
            <TextInput
              label="ชื่อเครื่องดื่ม"
              value={menu.menuname}
              {...orderCreateForm.getInputProps("getmenuname")}
              readOnly
            />

            <NumberInput
              label="จำนวน"
              placeholder="จำนวน"
              {...orderCreateForm.getInputProps("amount")}
            />
            <TextInput
              label="รายละเอียดเพิ่มเติม"
              placeholder="รายละเอียดเพิ่มเติม"
              {...orderCreateForm.getInputProps("detail")}
            />

            <NumberInput
              label="ราคารวม"
              placeholder="ราคารวม"
              value={orderCreateForm.values.total}
              readOnly
            />

            <Divider />

            <Button type="submit" loading={isProcessing}>
              ยืนยันคำสั่งซื้อ
            </Button>
          </form>
        </Container>
      </Layout>
    </>
  );
}
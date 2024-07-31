import { Alert, Button, Container, Divider } from "@mantine/core";
import Layout from "../components/layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Menu } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconEdit } from "@tabler/icons-react";

export default function MenuByIdPage() {
  const { menuId } = useParams();
  const { data: menu, isLoading, error } = useSWR<Menu>(`/menu/${menuId}`);
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate("/menu/order", { state: { menu } });
  };

  return (
    <>
      <Layout>
        <Container className="mt-4">
          {isLoading && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          {!!menu && (
            <>
              <h1>{menu.menuname}</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <img
                  src={menu.imgurl || "https://placehold.co/150x200"} 
                  alt={menu.menuname}
                  className="w-full object-cover aspect-[3/4]"
                />
                <div className="col-span-2 px-4 space-y-2 py-4">
                  <h3>ราคา</h3>
                  <p className="indent-4">
                    {menu.price}
                  </p>
                  <Button
                    onClick={handleOrder}
                    size="xs"
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    สั่งเครื่องดื่ม
                  </Button>
                </div>
              </div>

              <Divider className="mt-4" />

              <Button
                color="blue"
                size="xs"
                component={Link}
                to={`/menu/${menu.id}/edit`}
                className="mt-4"
                leftSection={<IconEdit />}
              >
                แก้ไขข้อมูลเมนูเครื่องดื่ม
              </Button>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
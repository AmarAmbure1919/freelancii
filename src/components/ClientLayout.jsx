// components/ClientLayout.jsx
"use client";

import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '@/components/Sidebar';
import Appbar from '@/components/Appbar';
import { useSidebar } from '@/context/SidebarContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClientLayout.css'; // Import external CSS

export default function ClientLayout({ children }) {
  const { isExpanded } = useSidebar();

  return (
    <>
      <Sidebar />
      <Appbar />
      
      <Container 
        fluid 
        className="p-0 main-layout-container"
        data-sidebar-expanded={isExpanded}
      >
        <div className="scrollable-content">
          <Container fluid className="py-4">
            <Row>
              <Col xs={12}>
                {children}
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}
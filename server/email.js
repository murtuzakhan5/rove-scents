import nodemailer from 'nodemailer';

// Helper to create transport based on environment or settings
function createTransporter(settings = {}) {
  const user = settings?.smtpUser || process.env.SMTP_USER || 'rovescentsofficial@gmail.com';
  const pass = settings?.smtpPass || process.env.SMTP_PASS;

  if (!pass) {
    return null;
  }

  // If host is explicitly provided in settings, use custom SMTP
  if (settings?.smtpHost || process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: settings?.smtpHost || process.env.SMTP_HOST,
      port: Number(settings?.smtpPort || process.env.SMTP_PORT || 465),
      secure: (settings?.smtpPort || process.env.SMTP_PORT) === '465' || true,
      auth: { user, pass }
    });
  }

  // Default: Gmail service
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
}

// 1. Send New Order Emails (Admin alert + Customer confirmation)
export async function sendNewOrderEmails(order, settings = {}) {
  const adminEmail = settings?.adminNotificationEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'rovescentsofficial@gmail.com';
  const fromEmail = settings?.smtpUser || process.env.SMTP_USER || 'rovescentsofficial@gmail.com';
  const storeName = settings?.storeName || 'ROVE SCENTS';

  const transporter = createTransporter(settings);

  // HTML line items table
  const itemsHtml = (order.items || []).map(item => `
    <tr style="border-bottom: 1px solid #222;">
      <td style="padding: 12px 8px; vertical-align: middle;">
        <div style="font-weight: 600; color: #fff; font-size: 14px;">${item.name || item.title}</div>
        ${item.size ? `<div style="font-size: 11px; color: #d4af37; text-transform: uppercase;">Size: ${item.size}</div>` : ''}
        ${item.variantName ? `<div style="font-size: 11px; color: #999;">Option: ${item.variantName}</div>` : ''}
      </td>
      <td style="padding: 12px 8px; text-align: center; color: #ccc; font-size: 13px;">${item.quantity || 1}</td>
      <td style="padding: 12px 8px; text-align: right; color: #d4af37; font-weight: 600; font-size: 14px;">Rs. ${(item.price * (item.quantity || 1)).toLocaleString()}</td>
    </tr>
  `).join('');

  // 1A. Admin Alert Email
  const adminSubject = `🛒 [NEW ORDER] #${order.id || order._id} • Rs. ${(order.total || 0).toLocaleString()} • ${order.customer?.fullName || 'Customer'}`;
  const adminHtml = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin: 0; padding: 0; background-color: #0b0b0b; font-family: 'Helvetica Neue', Arial, sans-serif; color: #e5e5e5;">
    <div style="max-width: 620px; margin: 20px auto; background-color: #121212; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      
      <!-- Brand Header -->
      <div style="background: linear-gradient(135deg, #1c1809 0%, #2b220c 50%, #151206 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #d4af37;">
        <h1 style="margin: 0; color: #d4af37; font-size: 24px; letter-spacing: 4px; text-transform: uppercase;">${storeName}</h1>
        <p style="margin: 6px 0 0; color: #bbb; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">✨ New Luxury Order Notification</p>
      </div>

      <!-- Main Body -->
      <div style="padding: 24px;">
        <div style="background: #181818; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #999; font-size: 12px; text-transform: uppercase;">Order Number:</span>
            <strong style="color: #d4af37; font-size: 14px;">#${order.id || order._id}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #999; font-size: 12px; text-transform: uppercase;">Payment Mode:</span>
            <span style="color: #4ade80; font-weight: bold; font-size: 13px;">${(order.paymentMethod || 'COD').toUpperCase()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #999; font-size: 12px; text-transform: uppercase;">Order Date:</span>
            <span style="color: #ccc; font-size: 12px;">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}</span>
          </div>
        </div>

        <!-- Customer Details -->
        <h3 style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #262626; padding-bottom: 6px;">Customer Details</h3>
        <table style="width: 100%; font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
          <tr>
            <td style="width: 120px; color: #888;">Name:</td>
            <td style="color: #fff; font-weight: 600;">${order.customer?.fullName || 'N/A'}</td>
          </tr>
          <tr>
            <td style="color: #888;">Phone / Mobile:</td>
            <td><a href="tel:${order.customer?.phone}" style="color: #60a5fa; text-decoration: none; font-weight: bold;">${order.customer?.phone || 'N/A'}</a> (WhatsApp: <a href="https://wa.me/${(order.customer?.phone || '').replace(/[^0-9]/g, '')}" style="color: #22c55e; text-decoration: none;">Chat on WhatsApp</a>)</td>
          </tr>
          <tr>
            <td style="color: #888;">Email:</td>
            <td style="color: #ccc;">${order.customer?.email || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="color: #888; vertical-align: top;">Delivery Address:</td>
            <td style="color: #fff;">${order.customer?.address || 'N/A'}, ${order.customer?.city || ''}</td>
          </tr>
          ${order.customer?.notes ? `
          <tr>
            <td style="color: #888; vertical-align: top;">Special Note:</td>
            <td style="color: #fbbf24; font-style: italic;">${order.customer?.notes}</td>
          </tr>` : ''}
        </table>

        <!-- Order Items -->
        <h3 style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #262626; padding-bottom: 6px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 1px solid #333; text-align: left; color: #888; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 8px;">Product</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Financial Summary -->
        <div style="background: #161616; border: 1px solid #2c2c2c; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <table style="width: 100%; font-size: 13px;">
            <tr>
              <td style="color: #888; padding: 4px 0;">Subtotal:</td>
              <td style="color: #fff; text-align: right;">Rs. ${(order.subtotal || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="color: #888; padding: 4px 0;">Delivery Charges:</td>
              <td style="color: #fff; text-align: right;">${(order.deliveryCharge || 0) === 0 ? '<span style="color: #4ade80;">FREE</span>' : `Rs. ${order.deliveryCharge}`}</td>
            </tr>
            ${order.discount ? `
            <tr>
              <td style="color: #888; padding: 4px 0;">Discount Applied:</td>
              <td style="color: #f87171; text-align: right;">- Rs. ${order.discount.toLocaleString()}</td>
            </tr>` : ''}
            <tr style="border-top: 1px solid #333;">
              <td style="color: #fff; font-weight: bold; font-size: 16px; padding-top: 10px;">Grand Total:</td>
              <td style="color: #d4af37; font-weight: bold; font-size: 18px; text-align: right; padding-top: 10px;">Rs. ${(order.total || 0).toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #888; font-size: 11px;">You can view, dispatch or cancel this order inside the ROVE SCENTS Admin Dashboard.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  // 1B. Customer Confirmation Email
  const customerHtml = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin: 0; padding: 0; background-color: #0b0b0b; font-family: 'Helvetica Neue', Arial, sans-serif; color: #e5e5e5;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #121212; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      
      <!-- Brand Header -->
      <div style="background: linear-gradient(135deg, #1c1809 0%, #2b220c 50%, #151206 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #d4af37;">
        <h1 style="margin: 0; color: #d4af37; font-size: 26px; letter-spacing: 5px; text-transform: uppercase;">${storeName}</h1>
        <p style="margin: 8px 0 0; color: #e5e5e5; font-size: 13px; letter-spacing: 1.5px;">Thank You for Your Order</p>
      </div>

      <div style="padding: 28px;">
        <p style="font-size: 15px; line-height: 1.6; color: #e5e5e5; margin-top: 0;">
          Dear <strong>${order.customer?.fullName || 'Valued Customer'}</strong>,
        </p>
        <p style="font-size: 13px; line-height: 1.6; color: #bbb;">
          Your order has been received and is now being handcrafted and packaged with utmost care. Below are the details of your purchase:
        </p>

        <!-- Order Info Card -->
        <div style="background: #181818; border: 1px solid #333; border-radius: 8px; padding: 14px; margin: 18px 0;">
          <div style="font-size: 13px; color: #ccc;">Order ID: <strong style="color: #d4af37;">#${order.id || order._id}</strong></div>
          <div style="font-size: 13px; color: #ccc; margin-top: 4px;">Payment: <strong style="color: #fff;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</strong></div>
          <div style="font-size: 13px; color: #ccc; margin-top: 4px;">Estimated Delivery: <strong style="color: #4ade80;">2 to 4 Business Days</strong></div>
        </div>

        <!-- Items Table -->
        <h4 style="color: #d4af37; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Your Selection</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 1px solid #333; text-align: left; color: #888; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 8px;">Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Total Box -->
        <div style="background: #161616; border: 1px solid #282828; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #999; margin-bottom: 4px;">
            <span>Subtotal:</span>
            <span style="color: #fff;">Rs. ${(order.subtotal || 0).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #999; margin-bottom: 4px;">
            <span>Nationwide Delivery:</span>
            <span style="color: #4ade80;">${(order.deliveryCharge || 0) === 0 ? 'FREE' : `Rs. ${order.deliveryCharge}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; border-top: 1px solid #333; padding-top: 8px; margin-top: 8px;">
            <span style="color: #fff;">Total Due:</span>
            <span style="color: #d4af37;">Rs. ${(order.total || 0).toLocaleString()}</span>
          </div>
        </div>

        <!-- Shipping Address -->
        <div style="background: #141414; border: 1px solid #262626; border-radius: 8px; padding: 14px; font-size: 12px; color: #aaa; margin-bottom: 24px;">
          <strong style="color: #d4af37; text-transform: uppercase; display: block; margin-bottom: 4px;">Shipping Address:</strong>
          ${order.customer?.fullName}<br/>
          ${order.customer?.address}, ${order.customer?.city}<br/>
          Phone: ${order.customer?.phone}
        </div>

        <!-- Footer Help -->
        <div style="text-align: center; border-top: 1px solid #262626; padding-top: 20px;">
          <p style="font-size: 12px; color: #888; margin-bottom: 6px;">Questions about your order?</p>
          <p style="font-size: 13px; margin: 0;">
            Email us at <a href="mailto:${adminEmail}" style="color: #d4af37; text-decoration: none;">${adminEmail}</a>
          </p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  if (!transporter) {
    console.warn(`[Email Service] SMTP password not set in environment or settings. Skipping email sending for order #${order.id}. (Admin: ${adminEmail})`);
    return {
      success: false,
      skipped: true,
      reason: 'SMTP not configured. Add SMTP_USER and SMTP_PASS in .env or Admin Settings to send live emails.'
    };
  }

  try {
    const results = {};

    // 1. Send Admin Notification
    try {
      const adminRes = await transporter.sendMail({
        from: `"${storeName}" <${fromEmail}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml
      });
      results.adminSent = true;
      results.adminMessageId = adminRes.messageId;
      console.log(`[Email Service] Admin notification sent for order #${order.id} to ${adminEmail}`);
    } catch (e) {
      results.adminError = e.message;
      console.error(`[Email Service] Failed to send admin email:`, e.message);
    }

    // 2. Send Customer Confirmation (if email exists)
    if (order.customer?.email && order.customer.email.includes('@')) {
      try {
        const custRes = await transporter.sendMail({
          from: `"${storeName}" <${fromEmail}>`,
          to: order.customer.email,
          subject: `✨ Order Confirmed #${order.id || order._id} - ${storeName}`,
          html: customerHtml
        });
        results.customerSent = true;
        results.customerMessageId = custRes.messageId;
        console.log(`[Email Service] Customer confirmation sent to ${order.customer.email}`);
      } catch (e) {
        results.customerError = e.message;
        console.error(`[Email Service] Failed to send customer email:`, e.message);
      }
    }

    return { success: true, ...results };
  } catch (err) {
    console.error('[Email Service] Unexpected error:', err.message);
    return { success: false, error: err.message };
  }
}

// 2. Send Order Status Change Email (Cancelled, Delivered, Shipped, Processing)
export async function sendOrderStatusUpdateEmail(order, status, extra = {}, settings = {}) {
  const adminEmail = settings?.adminNotificationEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'rovescentsofficial@gmail.com';
  const fromEmail = settings?.smtpUser || process.env.SMTP_USER || 'rovescentsofficial@gmail.com';
  const storeName = settings?.storeName || 'ROVE SCENTS';

  const transporter = createTransporter(settings);
  if (!transporter) return { success: false, reason: 'SMTP not configured' };

  const statusColors = {
    delivered: '#22c55e',
    shipped: '#3b82f6',
    cancelled: '#ef4444',
    processing: '#f59e0b',
    pending: '#a855f7'
  };

  const statusColor = statusColors[status.toLowerCase()] || '#d4af37';
  const statusTitle = status.toUpperCase();

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin: 0; padding: 0; background-color: #0b0b0b; font-family: 'Helvetica Neue', Arial, sans-serif; color: #e5e5e5;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #121212; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden;">
      
      <div style="background: linear-gradient(135deg, #1c1809 0%, #2b220c 50%, #151206 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid ${statusColor};">
        <h1 style="margin: 0; color: #d4af37; font-size: 22px; letter-spacing: 4px; text-transform: uppercase;">${storeName}</h1>
        <p style="margin: 8px 0 0; color: #fff; font-size: 13px;">Order Status Update</p>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 14px; color: #eee;">
          Order <strong>#${order.id || order._id}</strong> status has been updated:
        </p>

        <div style="text-align: center; padding: 18px; margin: 18px 0; background: #181818; border-radius: 8px; border: 1px solid #333;">
          <span style="display: inline-block; padding: 8px 18px; border-radius: 20px; font-weight: bold; font-size: 14px; letter-spacing: 1px; color: #000; background-color: ${statusColor};">
            ${statusTitle}
          </span>
          ${extra.trackingNumber ? `
          <div style="margin-top: 12px; font-size: 13px; color: #bbb;">
            Tracking Number: <strong style="color: #fff;">${extra.trackingNumber}</strong>
            ${extra.courier ? `(${extra.courier})` : ''}
          </div>` : ''}
          ${extra.note ? `
          <div style="margin-top: 8px; font-size: 12px; color: #aaa; font-style: italic;">
            "${extra.note}"
          </div>` : ''}
        </div>

        <div style="font-size: 13px; color: #bbb; line-height: 1.6;">
          <strong>Order Total:</strong> Rs. ${(order.total || 0).toLocaleString()}<br/>
          <strong>Customer:</strong> ${order.customer?.fullName || 'N/A'} (${order.customer?.city || ''})<br/>
          <strong>Phone:</strong> ${order.customer?.phone || 'N/A'}
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #222; text-align: center; font-size: 12px; color: #888;">
          ROVE SCENTS • Luxury French Haute Parfumerie • Pakistan
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  const recipients = [adminEmail];
  if (order.customer?.email && order.customer.email.includes('@')) {
    recipients.push(order.customer.email);
  }

  try {
    await transporter.sendMail({
      from: `"${storeName}" <${fromEmail}>`,
      to: recipients.join(', '),
      subject: `📦 Order #${order.id || order._id} Status Update: ${statusTitle} - ${storeName}`,
      html
    });
    console.log(`[Email Service] Status update (${status}) email sent for order #${order.id}`);
    return { success: true };
  } catch (err) {
    console.error(`[Email Service] Status email error:`, err.message);
    return { success: false, error: err.message };
  }
}

// 3. Send Test Email from Admin
export async function sendTestEmail(targetEmail, settings = {}) {
  const fromEmail = settings?.smtpUser || process.env.SMTP_USER || 'rovescentsofficial@gmail.com';
  const storeName = settings?.storeName || 'ROVE SCENTS';
  const transporter = createTransporter(settings);

  if (!transporter) {
    throw new Error('SMTP credentials not configured. Please enter your Gmail address and 16-character App Password.');
  }

  const info = await transporter.sendMail({
    from: `"${storeName}" <${fromEmail}>`,
    to: targetEmail || 'rovescentsofficial@gmail.com',
    subject: `✨ Test Email Verification - ${storeName}`,
    html: `
      <div style="background-color: #0b0b0b; color: #fff; padding: 24px; font-family: Arial; border-radius: 8px;">
        <h2 style="color: #d4af37; margin-top: 0;">${storeName} Email System Configured!</h2>
        <p>This is a verification test email confirming that your notification system is active.</p>
        <p>All future orders, cancellations, and delivery updates will be automatically delivered here.</p>
        <p style="color: #888; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
      </div>
    `
  });

  return { success: true, messageId: info.messageId };
}

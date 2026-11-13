const data = await resend.emails.send({
      from: 'LadyNest <onboarding@resend.dev>',
      to: ['ladynest1@gmail.com'],
      subject: `Naya Order Received: ${name}`,
      html: `
        <h2>Naye Order Ki Details</h2>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Address:</strong> ${address}</p>
        <hr />
        <h3>Ordered Items:</h3>
        <p>${itemsList}</p>
        <hr />
        <h3>Total Bill: Rs. ${total}</h3>
      `,
    });
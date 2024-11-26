import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import Handlebars from "handlebars";
import { X } from "lucide-react";

const ViewSubscription = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Record<string, any> | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState("");
  const [paidPrice, setPaidPrice] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/subscriptions/${id}`)
      .then((res) => {
        setSubscription(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subscription data");
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    // Define the Handlebars template as a string
    const template = `
    <div style="width: 210mm; padding: 20px;  direction: rtl">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Beiruti:wght@200..900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Tajawal", sans-serif;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .header img {
          height: 35px;
        }
        .sub-header {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
          padding-bottom: 15px;
          margin-bottom: 60px;
          border-bottom: 1px solid black;
          text-align: right;
        }
        .client-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 15px;
        }
        .details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          margin-bottom: 40px;
        }
        table th {
          padding: 10px;
          text-align: right;
          color: black;
          font-weight: bold;
        }
        table td {
          padding: 10px;
          border-bottom: 1px solid black;
          text-align: right;
        }
        .total-section {
          text-align: right;
          margin-top: 20px;
          margin-bottom: 20px;
          color: #666;
          font-size: 14px;
        }
        .footer {
          border-top: .5px solid black;
          width: 100%;
          position: absolute;
          bottom: 0;
        }
        .footer p {
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .address {
          font-size: 12px;
          color: #666;
        }
      </style>

      <div class="header">
        <div style="height: 80px;">
          <img src="/iq.webp" alt="Hoster.iq Logo" style="height: 100%; object-fit: cover;">
        </div>
        <div style="height: 40px;">
          <img src="/Hoster-iq.svg" alt="Iraq Logo" style="height: 100%; object-fit: cover;">
        </div>
      </div>

      <div class="sub-header">
        <span style="font-weight: bold; color: black;">شركة حد السيف للدعاية والاعلان </span>والمسجل المعتمد من هيئة الاعلام والاتصالات بعقد الترخيص: 63 بتاريخ 11/06/2024 
      </div>
  
      <div class="client-info">
        <div> 
          <div>اسم العميل: <br/><span style="color: #0066cc; font-size: 32px; font-weight: bold;">{{clientName}}</span></div>
        </div>

        <div>
          <div style="margin-bottom: 10px;">رقم الهاتف</div>
          <div style="color: #666;">{{phoneNumber}}</div>
        </div>
      </div>
        
      <div class="details">
        <div>
          <div style="margin-bottom: 10px;">تاريخ التقديم</div>
          <div style="color: #666;">{{submissionDate}}</div>
        </div>
        <div>
          <div style="margin-bottom: 10px;">انتهاء الصلاحية</div>
          <div style="color: #666;">{{expiryDate}}</div>
        </div>
        <div>
          <div style="margin-bottom: 10px;">الخطة المتكررة</div>
          <div style="color: #666;">شهرياً</div>
        </div>
        <div>
          <div style="margin-bottom: 10px;">مندوب المبيعات</div>
          <div style="color: #666;">Sales</div>
        </div>
      </div>
  
      <table style="">
        <thead>
          <tr>
            <th>الوصف</th>
            <th></th>
            <th>المبلغ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{selectedPlan}}</td>
            <td></td>
            <td>{{price}} د,ع</td>
          </tr>
          <tr>
            <td>{{notes}}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      
      <div class="total-section">
        يتم تجديد الاستضافة سنوياً
      </div>
  
      <table>
        <tr>
          <td style="text-align: right; padding: 10px;">إجمالي المبلغ:</td>
          <td style="text-align: left; padding: 10px;">{{price}} د.ع</td>
        </tr>
        <tr>
          <td style="text-align: right; padding: 10px;">تم دفع:</td>
          <td style="text-align: left; padding: 10px;">{{paidPrice}} د.ع</td>
        </tr>
      </table>
  
      <div style="width: 100%; margin-top: 40px; display: flex; justify-content: space-between;">
        <ul style="list-style: none;" class="address">
          <li style="font-size: 14px; color: black">مكتب بغداد: كرادة خارج, بغداد, 10001</li>
          <li style="font-size: 14px; color: black">مكتب البصرة: فندق جراند ملينيوم السيف بصرة</li>
        </ul>
        <div>
          <p style="font-weight: bold; margin-bottom: 15px;">شكراً لكم</p>
        </div>
      </div>

      <div class="footer">
        <p>الشروط والأحكام https://www.hoster.iq/terms</p>
      </div>
    </div>
  `;
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Generate the HTML with dynamic data
    const renderedHTML = compiledTemplate({
      selectedPlan,
      notes,
      paidPrice,
      ...subscription,
    });

    // Open a new window and print the content
    const printWindow = window.open("", "", "width=900,height=650");
    printWindow?.document.write(
      "<html><head><title>Invoice</title></head><body>"
    );
    printWindow?.document.write(renderedHTML);
    printWindow?.document.write("</body></html>");
    printWindow?.document.close();
    printWindow?.print();
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      {isOpen && (
        <div className="absolute w-full h-full bg-black/50 backdrop-blur-sm top-0 left-0 z-[100] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] sm:w-[400px] relative">
            <X
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 cursor-pointer"
            />

            <h1 className="text-xl font-bold text-gray-800 my-4">
              Plan & Payment
            </h1>

            <p className="text-sm text-gray-600 mb-6">
              Update the subscription details below:
            </p>

            {/* Plan Name Select Input */}
            <div className="mb-4">
              <label
                htmlFor="plan"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Plan Name
              </label>
              <select
                id="plan"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedPlan} // Replace with the default plan name if available
                onChange={(e) => setSelectedPlan(e.target.value)}
              >
                <option value="" disabled>
                  Select a plan
                </option>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            {/* Price Input */}
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Paid Price
              </label>
              <input
                type="number"
                id="price"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                min="0"
                defaultValue={paidPrice}
                onChange={(e) => setPaidPrice(e.target.value)}
              />
            </div>

            {/* Price Input */}
            <div className="mb-4">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Extra Notes (optional)
              </label>
              <input
                type="text"
                id="notes"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notes..."
                defaultValue={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  // Handle form submission logic
                  handlePrint();

                  setIsOpen(false);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold">View Subscription</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Display data in a read-only format */}
        <div>
          <strong>Domain Name:</strong>
          <p>{subscription?.domainName || "N/A"}</p>
        </div>

        <div>
          <strong>Client Name:</strong>
          <p>{subscription?.clientName || "N/A"}</p>
        </div>

        <div>
          <strong>Phone Number:</strong>
          <p>{subscription?.phoneNumber || "N/A"}</p>
        </div>

        <div>
          <strong>Documents Link:</strong>
          <p>
            {subscription?.documentsLink ? (
              <a
                href={subscription.documentsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Documents
              </a>
            ) : (
              "N/A"
            )}
          </p>
        </div>

        <div>
          <strong>Submission Date:</strong>
          <p>{subscription?.submissionDate || "N/A"}</p>
        </div>

        <div>
          <strong>Activation Date:</strong>
          <p>{subscription?.activationDate || "N/A"}</p>
        </div>

        <div>
          <strong>Expiry Date:</strong>
          <p>{subscription?.expiryDate || "N/A"}</p>
        </div>

        <div>
          <strong>Price Sold:</strong>
          <p>{subscription?.price ? `$${subscription.price}` : "N/A"}</p>
        </div>

        <div>
          <strong>Status:</strong>
          <p>{subscription?.status?.replace("_", " ") || "N/A"}</p>
        </div>

        <div>
          <strong>Payment Method:</strong>
          <p>{subscription?.paymentMethod?.replace("_", " ") || "N/A"}</p>
        </div>
      </div>

      {/* Create Invoice Button */}
      <div className="mt-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Create Invoice
        </Button>
      </div>
    </div>
  );
};

export default ViewSubscription;

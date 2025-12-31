import { useState, useRef, useEffect } from "react";
// import ExpandSection from "../item/ExpandSection.jsx";
// import ModifyOrgSec from "./ModifyOrgSec.jsx";
// import { useLocked } from '../contexts/LockedProvider.jsx'
// import { userDataContext } from "../contexts/UserProvider.jsx";
import type { CartType } from "@/types/CartType.js";
import { useAuth0 } from "@auth0/auth0-react";
import CartTitle from "./CartTitle";
import ItemsList from "../itemModules/ItemsList";

interface CartProps {
    cart: CartType
}

const Cart = ({cart} : CartProps) => {

    const [items, setItems] = useState([]);
  
    const [sectionHeight, setSectionHeight] = useState("45px");
    const [modifyOrgSec, setModifyOrgSec] = useState(false);
    const [modOrgHidden, setModOrgHidden] = useState(false);
    const [modifyOrgSecPosition, setModifyOrgSecPosition] = useState("below");
    const [isLoading, setIsLoading] = useState(false);
    

    const expandedSectionRef = useRef(null);
    const folderRef = useRef(null);
    const inputRef = useRef(null);
    // const folderTitleRef = useRef(title);

    const isLocked = false;
    //   const { isLocked } = useLocked();
    //   const { userData } = userDataContext();

    const [isExpanded, setIsExpanded] = useState(false);

  const updateScreenSize = () => {
    if (expandedSectionRef.current) {
      const expandedDisplayHeight = expandedSectionRef.current.scrollHeight;
      setSectionHeight(
        isExpanded && expandedDisplayHeight
          ? `${expandedDisplayHeight + 60}px`
          : "45px"
      );
    }
    if(items && items.length == 0 ) setIsExpanded(false); 
  };

  useEffect(() => {
      // Allow animation only after loading is done
      if(!isLoading) {
        updateScreenSize();
      }
  }, [isLoading, isExpanded, items]); // Trigger when loading or expanded state changes

//   useEffect(() => {
//     setSectionTitle(title);
//   }, [title]);

  const handleModifyClick = () => {
    if (!modOrgHidden && !isLocked) {
      setModifyOrgSec((prev) => !prev);
      if (folderRef.current) {
        const parentRect = folderRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - parentRect.bottom;

        setModifyOrgSecPosition(spaceBelow < 150 ? "above" : "below");
      }
    }
  };

  //handles editing name of a folder


  const handleTitleChange = (e) => {
    setSectionTitle(e.target.value);
  };

  // Edits an existing folder
//   const handleEditSection = (newFileName, cartId) => {
//       if (!isAuthenticated) return;
//       if (!cartId) return; 
//       if (!newFileName.trim()) return;
  
//       const isDuplicate = organizationSections.some(
//         (section) => section.cart_name === newFileName.trim() && section.cart_id !== cartId
//       );
//       if (isDuplicate) return;
  
//       const data = {
//         accessToken: userData,
//         newCartName: newFileName.trim(),
//         cartId: cartId,
//       };
  
//       chrome.runtime.sendMessage({ action: "editFolder", data }, (response) => {
//         if (chrome.runtime.lastError) {
//           console.error("Error communicating with background script:", chrome.runtime.lastError.message);
//           return;
//         }
  
//         if (response?.status === "success") {
//           setOrganizationSections((prev) =>
//             prev.map((section) =>
//               section.cart_id === cartId ? { ...section, cart_name: newFileName.trim() } : section
//             )
//           );
//         } else {
//           console.error("Error updating folder:", response?.message);
//         }
//       });
//   };

//   const handleTitleBlur = () => {
//     setIsEditing(false);
//     if(sectionTitle) {
//       folderTitleRef.current = sectionTitle;
//       handleEditSection(sectionTitle, sectionId);
//     }
//     else {
//       setSectionTitle(folderTitleRef.current);
//     }
//   };

//   const handleTitleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       setIsEditing(false);
//       if(sectionTitle) {
//         folderTitleRef.current = sectionTitle;
//         handleEditSection(sectionTitle, sectionId);
//       }
//       else {
//         setSectionTitle(folderTitleRef.current);
//       }
//     }
//   };

//   useEffect(() => {
//     const listener = (message) => {
//         if (message.action === "cartUpdate") {
//             const data = message.data;

//             setItemsInFolder((prevItems) => {
//                 const existingItem = prevItems.find(item => item.item_id === data.item_id);
//                 const isInSelectedCarts = data.selected_cart_ids.includes(sectionId);

//                 let updatedItems;

//                 if (isInSelectedCarts) {
//                     if (existingItem) {
//                         // Update the item if it already exists
//                         updatedItems = prevItems.map(item =>
//                             item.item_id === data.item_id ? { ...item, ...data } : item
//                         );
//                     } else {
//                         // Add the item if it doesn't exist
//                         updatedItems = [...prevItems, data];
//                     }
//                 } else {
//                     // Remove the item if the cart is no longer selected
//                     updatedItems = prevItems.filter(item => item.item_id !== data.item_id);
//                 }

//                 console.log("updated items: ", updatedItems);

//                 setIsLoading(true);

//                 // After updating itemsInFolder, update organizationSections
//                 setOrganizationSections((prevSections) =>
//                     prevSections.map(section =>
//                         section.cart_id === sectionId
//                             ? { ...section, items: updatedItems }
//                             : section
//                     )
//                 );
//                 setIsLoading(false);

//                 return updatedItems;  // Return for setItemsInFolder
//             });
//         }
//     };

//     chrome.runtime.onMessage.addListener(listener);

//     return () => chrome.runtime.onMessage.removeListener(listener);
//   }, []);

  return (
    <div className="bg-[var(--seconday-background)]">
      <CartTitle 
        cart={cart}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isLocked={isLocked}
        setItems={setItems}
        folderRef={folderRef}
      />
      {isExpanded && <ItemsList 
        items={items}
      />}
    </div>
//          {modifyOrgSec && (
//           <ModifyOrgSec
//             newFileName={sectionTitle}
//             setModifyOrgSec={setModifyOrgSec}
//             modOrgHidden={modOrgHidden}
//             setModOrgHidden={setModOrgHidden}
//             position={modifyOrgSecPosition}
//             ref={folderRef}
//             handleEditSection={handleEditSection}
//             cartId={sectionId}
//             handleTitleClick={handleTitleClick}
//             setOrganizationSections={setOrganizationSections}
//             cartName={sectionTitle}
//             showNotification={showNotification}
//           />
//         )} 
//       </div> 
//       <div className="expand-section-expanded-display" ref={expandedSectionRef}>
//         {itemsInFolder && itemsInFolder.map((item) => (
//           <ExpandSection
//             key={item.item_id}
//             item={item}
//             cartId={sectionId}
//             itemId={item.item_id}
//             cartsArray={organizationSections}
//             itemsInFolder={itemsInFolder} // <- items live inside the matched section
//             setItemsInFolder={setItemsInFolder}
//             showNotification={showNotification}
//           />
//         ))
//         }
//       </div> 
    );
}

export default Cart;

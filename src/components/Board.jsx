import { useState } from "react";

const Board = () => {
  const [items, setItems] = useState({
    data: {
      items: {
        movableItem: {
          totalItem: 2,
          itemList: {
            "Item 1": { h: 10, w: 20, x: 0, y: 0 },
            "Item 2": { h: 10, w: 20, x: 200, y: 100 },
          },
        },
      },
    },
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [dragging, setDragging] = useState(null);

  // Handle item click to display dimensions
  const handleItemClick = (itemKey) => {
    setSelectedItem(itemKey);
  };

  // Handle drag start
  const handleMouseDown = (e, itemKey) => {
    const { x, y } = items.data.items.movableItem.itemList[itemKey];
    setDragging({
      itemKey,
      offsetX: e.clientX - x,
      offsetY: e.clientY - y,
    });
  };

  // Handle dragging
  const handleMouseMove = (e) => {
    if (!dragging) return;

    const { itemKey, offsetX, offsetY } = dragging;

    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    setItems((prev) => {
      const updatedItems = { ...prev };
      updatedItems.data.items.movableItem.itemList[itemKey].x = newX;
      updatedItems.data.items.movableItem.itemList[itemKey].y = newY;
      return updatedItems;
    });
  };

  // Handle drag end
  const handleMouseUp = () => {
    setDragging(null);
  };

  // Render the items
  const renderItems = () => {
    const { itemList } = items.data.items.movableItem;

    return Object.entries(itemList).map(([key, { x, y, h, w }]) => (
      <div
        key={key}
        className={`absolute bg-blue-500 text-white font-bold flex justify-center items-center rounded-[30px] shadow-2xl cursor-pointer`}
        style={{
          top: `${y}px`,
          left: `${x}px`,
          height: `${h * 17}px`,
          width: `${w * 8.5}px`,
        }}
        onClick={() => handleItemClick(key)}
        onMouseDown={(e) => handleMouseDown(e, key)}
      >
        {key}
        {selectedItem === key && (
          <>
            {/* Show border with dots */}
            <div
              className="absolute border-2 border-gray-700 rounded-lg"
              style={{
                top: "-2px",
                left: "-2px",
                height: `${h * 17 + 4}px`,
                width: `${w * 8.5 + 4}px`,
              }}
            >
              {/* Four dots */}
              <div
                className="absolute bg-white border border-[#0085fe] border-solid"
                style={{
                  width: "8px",
                  height: "8px",
                  top: "-4px",
                  left: "-4px",
                }}
              ></div>
              <div
                className="absolute bg-white border border-[#0085fe] border-solid"
                style={{
                  width: "8px",
                  height: "8px",
                  top: "-4px",
                  right: "-4px",
                }}
              ></div>
              <div
                className="absolute bg-white border border-[#0085fe] border-solid"
                style={{
                  width: "8px",
                  height: "8px",
                  bottom: "-4px",
                  left: "-4px",
                }}
              ></div>
              <div
                className="absolute bg-white border border-[#0085fe] border-solid"
                style={{
                  width: "8px",
                  height: "8px",
                  bottom: "-4px",
                  right: "-4px",
                }}
              ></div>
            </div>

            {/* Show dimensions at bottom center */}
            <div
              className="absolute bg-[#0085fe] text-white font-regular text-[10px] px-2 py-1 rounded"
              style={{
                bottom: "-30px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {`${w * 15.5} X ${h * 31}`}
            </div>
          </>
        )}
      </div>
    ));
  };

  return (
    <div class="px-[40px] py-[20px] bg-[#e5e5e5]">
      <p class="text-[10px]">Board</p>
      <div
        id="board"
        className="relative w-full h-[calc(100vh-60px)] bg-gray-100"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 bg-gray-50"
          style={{
            backgroundSize: "10px 10px",
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          }}
        ></div>
        {renderItems()}
      </div>
    </div>
  );
};

export default Board;

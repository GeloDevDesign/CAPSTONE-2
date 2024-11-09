<script setup>

const props = defineProps(['inventoryPreparedItems','inventoryRawMaterials','listOfOutofStockandDeliver']);

</script>

<template>
  <div class="w-full mb-5 flex gap-8">
      <div class="stat rounded-lg bg-white flex flex-col gap-1 ">
        <div class="stat-title text-yellow-800 font-medium text-sm">Total</div>
        <div class="stat-value text-yellow-950 text-xl flex justify-between items-center">Prepared Meals
          <div class="bg-yellow-200 px-2 py-1 rounded-full">
            {{ props.inventoryPreparedItems.length || 0 }}
          </div>
        </div>
      </div>

      <div class="stat rounded-lg bg-white flex flex-col gap-1 ">
        <div class="stat-title text-yellow-800 font-medium text-sm">Total</div>
        <div class="stat-value text-yellow-950 text-xl flex justify-between items-center">Raw Ingredients
          <div class="bg-yellow-200 px-2 py-1 rounded-full">
            {{ props.inventoryRawMaterials.length || 0 }}
          </div>
        </div>
      </div>

      <div class="stat rounded-lg bg-white flex flex-col gap-1 ">
        <div class="stat-title text-red-800 font-medium text-sm">Total</div>
        <div class="stat-value text-red-950 text-xl flex justify-between items-center">Items Not Received
          <div class="bg-red-200 p-1 rounded-full">
           {{ props.listOfOutofStockandDeliver || 0 }}
          </div>
        </div>
      </div>
    </div>
</template>
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('item_id')->unique();
            $table->uuid('guid')->unique();
            $table->string('debug_name');
            $table->string('name');
            $table->string('equip_slot')->nullable();
            $table->string('category')->nullable();
            $table->string('rarity')->nullable();

            $table->unsignedInteger('min_level')->nullable();
            $table->unsignedInteger('max_level')->nullable();

            $table->decimal('damage_total', 10, 2)->nullable();
            $table->decimal('armor_total', 10, 2)->nullable();

            $table->string('weapon_category_type')->nullable();
            $table->string('weapon_class_type')->nullable();

            $table->string('icon_image')->nullable();

            $table->json('damage_distribution')->nullable();
            $table->json('armor_distribution')->nullable();

            $table->decimal('damage_speed_mod', 10, 4)->nullable();
            $table->decimal('damage_dmg_mod', 10, 4)->nullable();
            $table->decimal('weapon_durability_mod', 12, 6)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};

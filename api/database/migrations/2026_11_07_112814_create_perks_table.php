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
        Schema::create('perks', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('perk_id')->unique();
            $table->uuid('guid')->unique();
            $table->string('debug_name');
            $table->string('name')->nullable();
            $table->string('kind')->nullable();
            $table->text('description')->nullable();

            $table->json('damage_modifier')->nullable();
            $table->json('effects')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perks');
    }
};
